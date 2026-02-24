import libCom from '../Common/Library/CommonLibrary';
import libThis from './ConfirmationScenariosLibrary';
import Logger from '../Log/Logger';
import libQR from '../Common/Library/QRCodeLibrary';
import {GlobalVar} from '../Common/Library/GlobalCommon';
import libCrypto from '../Common/Library/CryptoLibrary';
import ConfirmationScenariosFeatureIsEnabled from './ConfirmationScenariosFeatureIsEnabled';
import ConfirmationScenariosFeatureIsEnabledWrapper from './ConfirmationScenariosFeatureIsEnabledWrapper';
import { setInterval as nsSetInterval, clearInterval as nsClearInterval } from '@nativescript/core/timer';
import CooperationIsEnabledForWorkOrder from './CooperationIsEnabledForWorkOrder';
import DoubleCheckIsEnabledForWorkOrder from './DoubleCheckIsEnabledForWorkOrder';
import libNetwork from '../Common/Library/NetworkMonitoringLibrary';
import ODataLibrary from '../OData/ODataLibrary';
import ServerCurrentDate from '../DateTime/CurrentDateTime';
import ServerCurrentTime from '../DateTime/CurrentTime';
import ConfirmationCreateFromOperation from '../Confirmations/CreateUpdate/ConfirmationCreateFromOperation';
import ConfirmationCreateFromWONav from '../Confirmations/CreateUpdate/ConfirmationCreateFromWONav';
import ConfirmationCreateFromSuboperation from '../Confirmations/CreateUpdate/ConfirmationCreateFromSuboperation';
import {confirmationScenarioSetup} from '../Confirmations/CreateUpdate/ConfirmationCreateUpdateOnPageLoad';
import { SecurityManager } from 'extension-SAMFoundation';
import NativeScriptObject from '../Common/Library/NativeScriptObject';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

/**
 * Routines for confirmation scenarios feature
 */

export default class ConfirmationScenariosLibrary {
    
    /**
     * Count down from the specified number of seconds after generating a QRCode
     * The QRCode is considered expired when the timer reaches zero
     * @param {*} context 
     * @param {*} seconds 
     */
    static async startQRCodeCounter(context, qrCodeObject) {
        let counter = await libThis.getExpiredSeconds(context);
        if (qrCodeObject && qrCodeObject.EndOnlineCall) { //Adjust start timer to subtract the time already spent in the online call
            const secondsDifference = Math.round((qrCodeObject.EndOnlineCall - qrCodeObject.StartOnlineCall) / 1000);
            counter -= secondsDifference;
        }
        const control = context.getPageProxy().getControl('SectionedTable').getControl('CountDownMessage');
        const timeExpires = qrCodeObject.VALID_TO;
        let expiresAt;

        if (timeExpires) expiresAt = new Date(timeExpires).getTime();

        if (control) {
            // Clear any existing interval before starting a new one
            libThis.terminateCountDownIfRunning(context);

            ConfirmationScenariosLibrary.intervalId = nsSetInterval(async () => { //IntervalId is a static variable for this class, not an instance variable.  Only one countdown can be running at a time.
                libThis.updateScreen(context, counter);

                counter--;

                if (expiresAt && ConfirmationScenariosLibrary.appResumed) { //Check if the current date is past the expired date to handle app going into background during countdown
                    const now = Date.now();
                    if (now > expiresAt) {
                        counter = -1; // Trigger expiration
                    }
                }

                if (counter < 0) {
                    nsClearInterval(ConfirmationScenariosLibrary.intervalId);
                    ConfirmationScenariosLibrary.intervalId = undefined;
                    await libThis.timerExpired(context, control);
                }
            }, 1000);
        } else {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Cannot find screen control for QR Code countdown in startQRCodeCounter');
            return false;
        }
        return true;
    }

    /**
     * Flag to indicate if the app was resumed during the countdown
     */
    static checkAppResumedDuringCountDown(context) {
        if (ConfirmationScenariosFeatureIsEnabled(context)) {
            if (ConfirmationScenariosLibrary.intervalId) {
                ConfirmationScenariosLibrary.appResumed = true; //Set the app resumed flag to true
            }
        }
    }

    /**
     * Terminate the countdown interval if it is still running
     */
    static terminateCountDownIfRunning(context) {
        libCom.removeStateVariable(context, 'QRCodeExpiredDisplayed'); //Clear the expired image flag
        if (ConfirmationScenariosLibrary.intervalId) {
            nsClearInterval(ConfirmationScenariosLibrary.intervalId);
            ConfirmationScenariosLibrary.intervalId = undefined;
        }
        ConfirmationScenariosLibrary.appResumed = false; //Reset the app resumed flag
    }

    /**
     * Update the screen timer field
     * Need to grab control reference each time instead of using a constant pointer.
     * MDK seems to randomly recreate the view, causing random crashes if we try to keep reusing the same control reference.
     * @param {*} context
     * @param {*} counter
     */
    static updateScreen(context, counter) {
        try {
            const message = context.localizeText('expired_code_countdown', [counter]);
            const controlNew = context.getPageProxy().getControl('SectionedTable').getControl('CountDownMessage');

            if (controlNew) {
                controlNew.setStyle('CooperationCenteredBlack');
                if (counter < 11) { //Change to red when less than 10 seconds
                    controlNew.setStyle('CooperationCenteredRed');
                }
                controlNew.setText(message);
                controlNew.redraw();
            }
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Failed to update QR Code countdown message in updateScreen');
        }
    }

    /**
     * Expire the QRCode on screen
     * @param {*} context 
     */
    static async timerExpired(context, control) {
        const message = context.localizeText('expired_code_message');

        control.setStyle('CooperationCenteredRed');
        control.setText(message);
        control.redraw();
        return await libThis.generateQRCodeAndRefresh(context); //Auto-generate a new QRCode when the timer expires (customer request)
    }

    /**
     * Generate the current dynamic QRCode for this user
     * @param {*} context 
     * @param {*} pass - Passcode used to encrypt the QRCode data
     */
    static async generateCurrentDynamicQRCode(context) {
        let guid;
        let online = libThis.isOnlineMode(context);
        let pass = await libThis.getDynamicPass(context);
        let qrCodeObject = await libThis.getCurrentDynamicObject(context); //Get the current dynamic object for this user

        if (qrCodeObject && qrCodeObject.PERNR) {
            let tempObject = JSON.parse(JSON.stringify(qrCodeObject)); //Create a copy of the object to avoid modifying the original
            const textStorage = await libThis.getTextStorage(context); //Get where the long text should be stored

            if (online) { //Online use case, so generate a GUID for encryption
                guid = libThis.generateGUID();
                pass = libThis.formatGUID(guid); //Format the GUID for encryption/decryption
            }
            //Do not store the long text in the QRCode if set for database in config and device is online
            if (textStorage === 'DB' && online) {
                tempObject.LONG_TEXT = '';
            }
            qrCodeObject.Online = online; //Set the online flag based on network connection
            qrCodeObject.GUID = guid; //Set the GUID for the QR Code storage record
            qrCodeObject.QRCode = ''; //Clear the QRCode field before encryption
            if (pass) {
                qrCodeObject.QRCode = 'D' + libCrypto.encryptAESWrapper(context, JSON.stringify(tempObject), pass); //Encrypt the data using AES-256
            }
            qrCodeObject.HashValue = libCrypto.hash256Base64(context, qrCodeObject.QRCode); //Hash the QR Code to a base64 SHA-256 string
            qrCodeObject.UserID = libCom.getSapUserName(context); //Get the current user's ID

            return qrCodeObject;
        }
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: No personnel number found for current user in generateCurrentDynamicQRCode');
        context.executeAction('/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeMissingPersonMessage.action');
        return '';
    }

    /**
     * Create an object with the current user's personnel number and other dynamic data
     * Used to create a QRCode for dynamic confirmation scenarios
     * @param {*} context 
     * @returns - Object with the current QR Code data
     */
    static async getCurrentDynamicObject(context) {
        let person = GlobalVar.getUserSystemInfo().get('PERNO'); //Get current user's personnel number
        person = parseInt(person, 10) || 0; //Convert to a number (matching Fiori)

        if (person) {
            let qrCodeObject = {};
            let commentControl = context.getPageProxy().getControl('SectionedTable').getControl('LongText');
            let comment = commentControl ? commentControl.getValue() : '';

            qrCodeObject.QRCODE_TYPE = 'D';
            qrCodeObject.PERNR = person;
            qrCodeObject.USER_NAME = libCom.getSapUserName(context); //Get the current user's ID
            qrCodeObject.CONFIRMATION_SCENARIOS = libThis.getUserAuthorizedScenarios(context); //Get the authorized scenarios for this user
            qrCodeObject.CREATED_ON = libThis.dateToUtcNumber(new Date()); //Store as UTC number: YYYYMMDDHHMMSS (matching Fiori)
            if (comment) qrCodeObject.LONG_TEXT = comment;
            return qrCodeObject;
        }
        return '';
    }

    /**
     * Get an array of scenarios that the user is authorized for
     * This includes user based app parameters for the scenarios
     * The app params are populated by backend via rules that look up the authorizations for the current user
     * @param {*} context
     */
    static getUserAuthorizedScenarios(context) {
        const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
        const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();
        let scenarios = [];
    
        if (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Conf.Create.Cooperation') === 'Y') scenarios.push(coopScenario);
        if (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Conf.Create.DoubleVerification') === 'Y') scenarios.push(doubleScenario);

        return scenarios; //Return as an array of strings
    }

    /**
     * Find the substitute scenario for this plant and parent scenario
     * If QR-Code is authorized for the substitute scenario, then it can be used when executing the parent scenario
     * Example: QR-Code is is only authorized for verification (20)
     * User wants to perform a cooperation (10) and scans the QR-Code
     * We see that the QR-Code only supports (20), so we check if (10) has a substitute scenario for this plant
     * If the substitute is (20), then we allow the cooperation to proceed since the QR-Code is authorized for (20)
     * @param {*} context 
     * @param {*} scenario - The parent scenario to check for a substitute
     * @param {*} plant - The planning plant for the current work order
     */
    static async getSubstituteScenario(context, scenario, plant) {
        if (plant && scenario) { //Look up the substitute scenario for this plant and scenario
            let rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodePlantCtrlParams', ['SubstituteScenario'], `$filter=Plant eq '${plant}' and ConfScenario eq '${scenario}' and Inactive ne 'X'`);
            if (rows && rows.length > 0) {
                let row = rows.getItem(0);
                if (row.SubstituteScenario) {
                    return row.SubstituteScenario;
                }
            }
        }
        return ''; //No substitute found
    }

    /**
     * Is the current user authorized for this scenario?
     * THIS IS CURRENTLY UNUSED, BUT MAY BE NEEDED IN THE FUTURE
     * @param {*} context 
     * @param {*} scenario - The scenario to check for authorization
     * @param {*} plantOverride - Optional, if passed, will override the plant. Currently used for ad-hoc confirmation case where user is manually choosing the work order
     * @returns 
     */
    static async isUserAuthorizedForScenario(context, scenario, plantOverride='') {
        let binding = context.binding;

        if (!binding) {
            binding = context.getPageProxy()?.getActionBinding();
        }

        let {plant} = libThis.getPlantAndOrderType(binding, plantOverride);
        let scenarios = libThis.getUserAuthorizedScenarios(context, plant);

        if (scenarios) {
            try {
                const scenarioList = JSON.parse(scenarios);
                return scenarioList.includes(scenario);
            } catch (error) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Invalid JSON format for CONFIRMATION_SCENARIOS in isUserAuthorizedForScenario');
            }
        }
        return false; //No scenarios found or invalid format
    }

    /**
     * Read global feature config parameters
     * @param {*} context 
     */
    static async readGlobalConfig(context) {
        let fioriID = libCom.getAppParam(context, 'CONFIRMATION_SCENARIOS', 'FioriID'); //Backend Application ID for this SSAM feature
        if (!fioriID) fioriID = 'F5104A'; //Default for now
        let rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeDynamicCtrlParams', [], "$filter=FioriID eq '" + fioriID + "'");
        if (rows && rows.length > 0) {
            return rows.getItem(0);
        }
     
        return '';
    }

    /**
     * Read dynamic feature config parameters
     * @param {*} context 
     */
    static async readDynamicConfig(context) {
        let fioriID = libCom.getAppParam(context, 'CONFIRMATION_SCENARIOS', 'FioriID'); //Backend Application ID for this SSAM feature
        if (!fioriID) fioriID = 'F5104A'; //Default for now
        let rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeDynamicCtrlParams', [], "$filter=FioriID eq '" + fioriID + "'");
        if (rows && rows.length > 0) {
            return rows.getItem(0);
        }
     
        return '';
    }

    /**
     * Look up feature config parameters for this plant using currently selected work order
     * @param {*} context 
     */
    static async readConfigByPlant(context, workOrder, scenario) {
        if (workOrder) {
            let workOrderRow = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${workOrder}')`, ['PlanningPlant'], '');
            if (workOrderRow && workOrderRow.length > 0) {
                let rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodePlantCtrlParams', [], `$filter=Plant eq '${workOrderRow.getItem(0).PlanningPlant}' and ConfScenario eq '${scenario}' and Inactive ne 'X'`);
                if (rows && rows.length > 0) {
                    return rows.getItem(0);
                }
                //WO Plant not found, try for * wildcard instead
                rows = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodePlantCtrlParams', [], "$filter=Plant eq '*' and ConfScenario eq '${scenario}' and Inactive ne 'X'");
                if (rows && rows.length > 0) {
                    return rows.getItem(0);
                }
            }
        }
        return '';
    }

    /**
     * Get the number of seconds that a generated QR Code should remain valid from global configuration
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getExpiredSeconds(context, tempResult='') {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readGlobalConfig(context);
        }
    
        let duration = result.Validity;
        if (!libCom.isNumeric(duration)) {
            duration = 90; //default to 90 seconds if no duration found in config
        }
    
        return duration;
    }

    /**
     * Get the flag to determine if double-check is mandatory for an operation before it can be completed
     * MyWorkOrderOperations and MyWorkOrderSubOperations has a new property called MaintJobVerification
     * This will be set to the scenario required.  Double-check is '20'
     * @param {*} context
     * @param {*} workorder
     * @param {*} operation
     * @param {*} subOperation
     * @returns 
     */
    static async getMandatoryDoubleCheck(context, workorder, operation, subOperation) {
        if (workorder && operation) {
            let subFilter = '';
            let entitySet = 'MyWorkOrderOperations';

            if (subOperation) {
                subFilter = ` and SubOperationNo eq '${subOperation}'`;
                entitySet = 'MyWorkOrderSubOperations';
            }
            const doubleCheck = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();
            let filter = `$filter=OrderId eq '${workorder}' and OperationNo eq '${operation}' and MaintJobVerification eq '${doubleCheck}'` + subFilter;
            let count = await context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, filter);

            if (count > 0) return true; //Mandatory double-check is required for this operation or sub-operation
        }

        return false; //No record found or invalid parameters
    }

    /**
     * Check if the mandatory double-check requirement has not yet been satisfied for this operation
     * First we see if this operation requires mandatory double-check, then we see if a double-check confirmation already exists for this operation
     * @param {*} context 
     * @param {*} workorder 
     * @param {*} operation 
     */
    static async isDoubleCheckRequiredForThisOperation(context, workorder, operation, subOperation = '', plantOverride = '') {
        if (libThis.getDoubleCheckGlobalAuthorization(context)) { //Are double-checks enabled globally?
            if (ConfirmationScenariosFeatureIsEnabledWrapper(context) && await libThis.getMandatoryDoubleCheck(context, workorder, operation, subOperation) && await DoubleCheckIsEnabledForWorkOrder(context, plantOverride)) {
                const doubleCheck = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();

                let subFilter = '';
                if (subOperation) {
                    subFilter = ` and SubOperation eq '${subOperation}'`;
                }
                let filter = `$filter=OrderID eq '${workorder}' and Operation eq '${operation}' and ConfirmationScenario eq '${doubleCheck}'` + subFilter;
                let count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', filter);

                if (count > 0) {
                    return false; //At least one double-check confirmation found
                }
                return true; //No double-check confirmations found
            }
        }

        return false; //Feature not enabled, or double-check invalid for this work order, or mandatory double-check is disabled
    }

    /**
     * Get the text enabled flag to determine if user can enter comments on generate QR Code screen
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns Boolean
     */
    static async getTextEnabled(context, tempResult='') {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readGlobalConfig(context);
        }

        return result.ConfTextFlag === 'X';
    }

    /**
     * Get the text maximum length for long text comments on generate QR Code screen
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getTextMaxLength(context, tempResult='') {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readGlobalConfig(context);
        }

        return result.ConfTextLength;
    }

    /**
     * Get where longtext should be stored
     * This is used to determine if the long text should be stored in the QRCodeStorage table or in the QRCode itself
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database 
     * @returns 
     */
    static async getTextStorage(context, tempResult='') {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readGlobalConfig(context);
        }

        return result.ConfTextStorage === '10' ? 'DB' : 'QR'; //Return 'DB' for database storage, 'QR' for QR Code storage
    }

    /**
     * Check config to see if cooperation user is allowed to adjust confirmation time
     * @param {*} context 
     * @param {*} tempResult - optional, if passed, will use this result instead of reading from the database
     * @param {*} workOrder - optional, The work order to check for the plant
     * @param {*} scenario - optional, The scenario to use in config lookup
     * @returns 
     */
    static async getAllowTimeUpdate(context, tempResult='', workOrder='', scenario='') {
        let result;
        
        if (tempResult) {
            result = tempResult;
        } else {
            result = await libThis.readConfigByPlant(context, workOrder, scenario);
        }

        if (result) return result.RecordTime === 'X';
        return false;
    }

    /**
     * Get the passcode used to encrypt/decrypt dynamic QR Codes
     * This will be an app parameter for offline use, or the GUID from the QRCode storage row in the QRCodeStorage table for online
     * @param {*} context 
     * @returns 
     */
    static async getDynamicPass(context) {
        let seed = libCom.getAppParam(context, 'CONFIRMATION_SCENARIOS', 'QRCodeSeed');
        
        if (seed) {
            try {
                let pass = SecurityManager.getInstance().generateConfirmationScenarioPasscode(seed);
                if (pass) {
                    return pass.length > 32 ? pass.slice(0, 32) : pass;
                } else {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Failed to generate confirmation scenario passcode in getDynamicPass');
                }
            } catch (error) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),`ERROR: Exception generating confirmation scenario passcode in getDynamicPass: ${error}`);
            }
        }
        
        return ''; //Passcode not configured or error generating it with SecurityManager
    }

    /**
     * Process the encrypted QR Code data and pass back the unencrypted string as an object of key/value pairs
     * @param {*} context 
     * @param {*} scanData 
     * @returns 
     */
    static async processQRCode(context, scanData) {
        const type = scanData.substring(0,1);
        let processedData = await libThis.decryptQRCode(scanData.substring(1), type, context);
        
        if (processedData) {
            try {
                let qrCodeObject = JSON.parse(processedData.DecryptedData);
                qrCodeObject.Type = type;
                if (processedData.LongText) {
                    qrCodeObject.LONG_TEXT = processedData.LongText; //Add the long text if it exists in db
                }
                processedData.QRCodeProperties = qrCodeObject;
                return processedData; //Return the processed data with the scan object
            } catch (error) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Failed to parse QR Code data in processQRCode');
                return '';
            }
        }
    
        return '';
    }
    
    /**
     * Decrypt the encrypted scan data based on type
     * @param {*} context 
     * @param {*} scanData - The raw encypted QRCode data (minus the 1st character)
     * @param {*} type  - The first unencrypted byte of the QRCode, either 'S' for static or 'D' for dynamic
     * @returns 
     */
    static async decryptQRCode(scanData, type, context) {
        if (type === 'D' || type === 'S') { //Dynamic or Static QR Code
            if (libThis.isOnlineMode(context)) { //Online case, try to look up the QR Code in the database
                let result = await libThis.decryptQRCodeFromOfflineService(context, scanData, type); //Check offline db
                if (!result.DecryptedData) { //try to lookup using online store
                    result = await libThis.decryptQRCodeFromOnlineService(context, scanData, type); //Check online db
                    context.dismissActivityIndicator();
                }
                if (!result.DecryptedData && type === 'D') { //try to decrypt using dynamic passcode
                    result = await libThis.decryptOfflineDynamicQRCode(context, scanData); //Offline dynamic case
                }
                if (result) {
                    result.Online = true;
                }

                return result;
            } else {
                let result = await libThis.decryptQRCodeFromOfflineService(context, scanData, type); //Check offline db
                if (!result.DecryptedData && type === 'D') { //try to decrypt using dynamic SAM passcode
                    result = await libThis.decryptOfflineDynamicQRCode(context, scanData); //Offline dynamic case
                }

                return result;
            }
        }

        return scanData; //Return raw data for other types
    }

    /**
     * Look up the GUID row for the scanned data using offline db and return the decrypted QRCode data
     * @param {*} context 
     * @param {*} scanData 
     * @returns 
     */
    static async decryptQRCodeFromOfflineService(context, scanData, type) {
        let hash = libCrypto.hash256Base64(context, type + scanData); //Base64 hash from offline db is OK to read with
        if (hash) {
            //Look up the record in the offline database
            let result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeStorage', ['GUID', 'LongText'], `$filter=HashValue eq '${hash}'`);
            if (result && result.length > 0) {
                let row = result.getItem(0);
                let passcode = libThis.formatGUID(row.GUID);
                let decryptedData = libCrypto.decryptAESWrapper(context, scanData, passcode); //Decrypt the data using AES-256
                let results = {};

                results.DecryptedData = decryptedData;
                results.Guid = row.GUID;
                results.LongText = row.LongText;
                results.DecryptMethod = 'Offline'; //Indicate this was an offline decryption
                return results;
            }
        }
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: No record found matching QRCode scan data in getDecryptedQRCodeFromDatabase');
        return '';
    }

    /**
     * Look up the GUID row using online service call for the scanned data and return the decrypted QRCode data
     * @param {*} context 
     * @param {*} scanData 
     * @returns 
     */
    static async decryptQRCodeFromOnlineService(context, scanData, type) {
        try {
            context.showActivityIndicator(context.localizeText('online_request_initiated'));
            let hash = libCrypto.base64ToHex(libCrypto.hash256Base64(context, type + scanData)); //Hash the QR Code data to a hex string. Gateway does this conversion for some reason when reading from online service
            if (hash) {
                //Look up the static record in the database
                await ODataLibrary.initializeOnlineService(context);
                let result = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'QRCodeStorage', ['GUID', 'LongText'], `$filter=HashValue eq '${hash}'`);
                if (result && result.length > 0) {
                    let row = result.getItem(0);
                    let passcode = libThis.formatGUID(row.GUID);
                    let decryptedData = libCrypto.decryptAESWrapper(context, scanData, passcode); //Decrypt the data using AES-256
                    let results = {};

                    results.DecryptedData = decryptedData; //Decrypted data
                    results.Guid = row.GUID;
                    results.DecryptMethod = 'Online'; //Indicate this was an online decryption
                    results.LongText = row.LongText;
                    context.dismissActivityIndicator();
                    return results;
                }
            }
            Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: No record found matching QRCode scan data in getDecryptedQRCodeFromDatabase');
            context.dismissActivityIndicator();
            return '';
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOnlineQuery.global').getValue(), 'decryptQRCodeFromOnlineService: ' + error);
        }
        context.dismissActivityIndicator();
        return '';
    }

    /**
     * Process offline static passcode case
     * @param {*} context 
     * @param {*} scanData 
     * @returns 
     */
    static async decryptOfflineDynamicQRCode(context, scanData) {
        let pass = await libThis.getDynamicPass(context);

        if (pass) {
            let decryptedData = libCrypto.decryptAESWrapper(context, scanData, pass); //Decrypt the data using AES-256
            let results = {};

            results.DecryptedData = decryptedData; //Decrypted data
            results.DecryptMethod = 'OfflineDynamicPass'; //Offline static passcode
            results.Guid = ''; //Placeholder that will get replaced with the actual GUID later
            return results;
        } else {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: No passcode found for dynamic QR Code decryption in decryptQRCode');
            return '';
        }
    }
    
    /**
     * Check the scanned QR code data for validity
     * Returns boolean and sets an error action state variable if invalid
     * @param {*} context
     * @param {*} scanObject - The scan object containing information about what was scanned
     */
    static async validateQRCode(context, scanObject) {
        let qrCodeObject = scanObject.QRCodeProperties;
        let valid = false;
        let scenario = libCom.getStateVariable(context, 'ConfirmationScenario'); //The user's chosen scenario
    
        valid = await libThis.employeeCheck(context, qrCodeObject);
        if (valid) valid = await libThis.scenarioCheckForQRCode(context, scanObject, scenario);
        if (valid) valid = await libThis.timeCheck(context, qrCodeObject);
        if (valid) libCom.removeStateVariable(context, 'ConfirmationScenarioErrorAction');
        
        return valid;
    }
    
    /**
     * Check that the employee exists
     * @param {*} context 
     * @param {*} scanObject - The scan object containing the QR Code data
     * @returns 
     */
    static async employeeCheck(context, scanObject) {
        let errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeInvalidMessage.action';
    
        if (scanObject.PERNR) {
            let employee = scanObject.PERNR.toString();
            let userPersonnel = libCom.getPersonnelNumber(context).toString();

            //Pad the personnel numbers to 8 digits
            if (userPersonnel.length < 8) {
                userPersonnel = userPersonnel.padStart(8, '0');
            }
            if (employee.length < 8) {
                employee = employee.padStart(8, '0');
            }

            if (employee === userPersonnel && libThis.isNotDemoMode(context)) { //Do not allow self-confirmation unless running the demo
                errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeBadEmployeeMessage.action';
                libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
                return false;
            }

            let count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'Employees', `$filter=PersonnelNumber eq '${employee}'`);
            if (count === 0) { //Employee doesn't exist
                errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeBadEmployeeMessage.action';
                libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
                return false;
            }
        } else { //Bad QR Code data
            libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
            return false;
        }
        return true;
    }
    
    /**
     * Check for valid scenario type
     * @param {*} context 
     * @param {*} scanObject - The scan object containing the QR Code data 
     * @param {*} scenario - The scenario to look for in the scan object. QR Code is invalid for this scan context if not found
     * Currently supports '10' for cooperation and '20' for double-check verification
     * @returns 
     */
    static async scenarioCheckForQRCode(context, scanObject, scenario) {
        let errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeInvalidScenarioMessage.action';
        try {
            let qrCodeObject = scanObject.QRCodeProperties;
        
            if (qrCodeObject.QRCODE_TYPE === 'D') { //Dynamic QR Code
                if (qrCodeObject.CONFIRMATION_SCENARIOS) {
                    try {
                        let scenarioList = qrCodeObject.CONFIRMATION_SCENARIOS;
                        if (Array.isArray(scenarioList)) { 
                            if (scenarioList.includes(scenario)) { //Scenario is valid for this QR Code
                                return true;
                            }
                            //Check if there is a substitute scenario for this plant and parent scenario that matches the QR Code
                            let {plant} = libThis.getPlantAndOrderType(context.binding);
                            let substitute = await libThis.getSubstituteScenario(context, scenario, plant);

                            if (substitute && scenarioList.includes(substitute)) { //Substitute scenario is valid for this QR Code
                                return true;
                            }
                        } else { //Invalid format
                            throw new Error('');
                        }
                    } catch (error) {
                        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Invalid JSON format for CONFIRMATION_SCENARIOS in scanObject in scenarioCheckForQRCode');
                        libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
                        return false;
                    }
                    errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeUnsupportedScenarioMessage.action'; //The scenario is not supported by this QR Code
                    libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
                    return false;
                } else { //Bad QR Code data
                    libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
                    return false;
                }
            } else if (qrCodeObject.QRCODE_TYPE === 'S') { //Static QR Code
                let results = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeConfScenarios', ['ConfScenario', 'ValidFrom', 'ValidTo'], `$filter=GUID eq guid'${scanObject.Guid}' and Deleted ne 'X'`);
                if (!results || results.length === 0) { //No offline scenarios found for this static QR Code
                    if (libThis.isOnlineMode(context)) { //Check online store. GUID must be formatted as uppercase without dashes for online store read
                        await ODataLibrary.initializeOnlineService(context);
                        results = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'QRCodeConfScenarios', ['ConfScenario', 'ValidFrom', 'ValidTo'], `$filter=GUID eq '${libThis.formatGUID(scanObject.Guid)}' and Deleted ne 'X'`);
                    }
                }
                if (results && results.length > 0) { //Found scenarios for this static QR Code in offline or online db
                    let scenariosValid = [];

                    results.forEach(row => { //Create an array of the results
                        scenariosValid.push({ConfScenario: row.ConfScenario, ValidFrom: row.ValidFrom, ValidTo: row.ValidTo});
                    });
                    let found = scenariosValid.find(obj => obj.ConfScenario === scenario);

                    if (found) { //Original scenario is supported by this QR Code. Convert server time to local time
                        qrCodeObject.VALID_FROM = OffsetODataDate(context, found.ValidFrom).date();
                        qrCodeObject.VALID_TO = OffsetODataDate(context, found.ValidTo).date();
                        return true;
                    }
                    //Check if there is a substitute scenario for this plant and parent scenario that matches the QR Code
                    let {plant} = libThis.getPlantAndOrderType(context.binding);
                    let substitute = await libThis.getSubstituteScenario(context, scenario, plant);

                    if (substitute) { //Substitute scenario is valid for this QR Code
                        found = scenariosValid.find(obj => obj.ConfScenario === substitute);
                        if (found) { //Convert server time to local time
                            qrCodeObject.VALID_FROM = OffsetODataDate(context, found.ValidFrom).date();
                            qrCodeObject.VALID_TO = OffsetODataDate(context, found.ValidTo).date();
                            return true;
                        }
                    }
                }
                errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeUnsupportedScenarioMessage.action'; //The scenario is not supported by this QR Code
                libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
                return false;
            }
            libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
            return false; //Invalid QR Code type
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),`ERROR: Exception in scenarioCheckForQRCode: ${error}`);
            libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', 'UNKNOWN_ERROR');
            return false;
        }
    }
    
    /**
     * Check to see if the scan took place within the valid date/time limits
     * @param {*} context 
     * @param {*} scanObject 
     * @returns 
     */
    static async timeCheck(context, scanObject) {
        let errorAction;
        
        if (scanObject.QRCODE_TYPE === 'D') { //Dynamic code
            errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeExpiredMessage.action';
            //Build the from/to timestamps for dynamic QR Codes based on the CREATED_ON timestamp and the validity seconds from config
            let seconds = await libThis.getExpiredSeconds(context);
            if (seconds) {
                scanObject.VALID_FROM = libThis.utcNumberToDate(scanObject.CREATED_ON);
                scanObject.VALID_TO = libThis.utcNumberToDate(scanObject.CREATED_ON, seconds);
            }
        } else { //Static code
            errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeStaticExpiredMessage.action';
        }
    
        if (scanObject.VALID_FROM && scanObject.VALID_TO) { //This QR Code has an expiration date
            const currentDate = new Date();
            if (currentDate < scanObject.VALID_FROM || currentDate > scanObject.VALID_TO) { //QR Code is expired
                libCom.setStateVariable(context, 'ConfirmationScenarioErrorAction', errorAction);
                return false;
            }
        }
        return true; //No expiration, or scan occurred between from/to stamps
    }

    /**
     * Generate a new dynamic QR code and refresh the image screen control that displays it
     * @param {*} context 
     */
    static async generateQRCodeAndRefresh(context) {
        libCom.removeStateVariable(context, 'QRCodeExpiredDisplayed'); //Clear the expired image flag
        let success = true;
        let pageProxy = context.getPageProxy();
        let clientData = pageProxy.getClientData();
        let results = await libThis.generateCurrentDynamicQRCode(context);

        libThis.emptyQRCodeControl(context); //Blank out current QRCode
        if (results.QRCode) {
            if (results.Online) { //Post the QRCode to online store
                results.StartOnlineCall = new Date();
                context.showActivityIndicator(context.localizeText('posting_to_server'));
                success = await libThis.postQRCodeStorageToOnlineStore(context, results);
                context.dismissActivityIndicator();
                results.EndOnlineCall = new Date(); //Save start and end time of the online call to adjust on screen countdown timer
            }
            if (success) {
                clientData.QRCodeImageSource = libQR.generateQRCode(results.QRCode);
                await pageProxy.getControl('SectionedTable').getSection('SectionImage').redraw();
                libThis.startQRCodeCounter(context, results); //Start the QR Code on-screen counter
                return results;
            } else {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Failed to post QR Code to online store in generateQRCodeAndRefresh');
                return results;
            }
        }
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR: Failed to generate QR Code text in generateQRCodeAndRefresh');
        return results;
    }

    /**
     * Blank out the current QR Code image
     * @param {*} context 
     */
    static emptyQRCodeControl(context) {
        let pageProxy = context.getPageProxy();
        let clientData = pageProxy.getClientData();
        clientData.QRCodeImageSource = '';
        pageProxy.getControl('SectionedTable').getSection('SectionImage').redraw();
    }

    /**
     * Set current QR Code image to expired
     * Used when user is typing in a note to invalidate the current QR-Code to avoid scanning by mistake
     * @param {*} context 
     */
    static displayExpiredQRCodeControl(context) {
        let darkMode = NativeScriptObject.getNativeScriptObject(context).applicationModule.systemAppearance() === 'dark';
        let pageProxy = context.getPageProxy();
        let clientData = pageProxy.getClientData();
        const control = context.getPageProxy().getControl('SectionedTable').getControl('CountDownMessage');

        libThis.terminateCountDownIfRunning(context);
        libCom.setStateVariable(context, 'QRCodeExpiredDisplayed', true); //Set flag that expired image is being displayed
        clientData.QRCodeImageSource = darkMode ? '/SAPAssetManager/Images/expiredcode.light.png': '/SAPAssetManager/Images/expiredcode.dark.png';
        pageProxy.getControl('SectionedTable').getSection('SectionImage').redraw();
        control.setText(''); //Clear out the countdown message
        control.redraw();
    }
 
    /**
     * Used to determine if confirmation scenarios should be enabled for the current work order
     * PerformMaintJobCtrlParams entity is used to decide this for cooperations
     * Double-Checks are globally enabled via app parameter
     * @param {*} context
     * @param {*} scenario - The scenario to check for, e.g. '10' for cooperation, '20' for double-check verification
     * @param {*} plantOverride - Passed in on change of the workorder picker on confirmation create screen
     * @param {*} orderTypeOverride - Passed in on change of the workorder picker on confirmation create screen
     * @returns 
     */
    static async scenarioIsEnabledForWorkOrder(context, scenario, plantOverride, orderTypeOverride) {
        if (ConfirmationScenariosFeatureIsEnabledWrapper(context)) {
            let binding = context.binding;
            let count = 0;
            const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
            const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();

            if (!binding) {
                binding = context.getPageProxy()?.getActionBinding();
            }
            if (binding) {
                let { plant, orderType } = libThis.getPlantAndOrderType(binding, plantOverride, orderTypeOverride);

                if (scenario === doubleScenario && plant) { //Current work order must exist (ad-hoc case)
                    if (libThis.getDoubleCheckGlobalAuthorization(context)) count = 1; //Double-checks have global authorization
                }
                if (scenario === coopScenario && plant && orderType) { //Check if plant and order type are valid for parent feature     
                    count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'PerformMaintJobCtrlParams', `$filter=EnableCooperation eq 'X' and Plant eq '${plant}' and OrderType eq '${orderType}'`);
                }

                if (count > 0) return true;
            }
            return false; //Bad binding, bad plant and order type data, or no record found for this plant and order type, or scenario not found
        }
        return false; //Feature or confirmations is disabled or user not authorized for confirmations
    }

    /**
     * Returns the plant and orderType of the current work order, operation or suboperation
     * @param {*} binding 
     * @param {*} plantOverride - Passed in from the calling function if we want to override the plant
     * @param {*} orderTypeOverride - Passed in from the calling function if we want to override the order type
     * @returns
     */
    static getPlantAndOrderType(binding, plantOverride, orderTypeOverride) {
        let plant, orderType;

        if (plantOverride || orderTypeOverride) {
            plant = plantOverride;
            orderType = orderTypeOverride;
        } else { //use binding object to get plant and order type
            switch (binding['@odata.type']) {
                case '#sap_mobile.MyWorkOrderHeader':
                    plant = binding.PlanningPlant;
                    orderType = binding.OrderType;
                    break;
                case '#sap_mobile.MyWorkOrderOperation':
                    plant = binding.WOHeader?.PlanningPlant;
                    orderType = binding.WOHeader?.OrderType;
                    break;
                case '#sap_mobile.MyWorkOrderSubOperation':
                    plant = binding.WorkOrderOperation?.WOHeader?.PlanningPlant;
                    orderType = binding.WorkOrderOperation?.WOHeader?.OrderType;
                    break;
                default: //Confirmation screen or other scenario
                    plant = binding.ConfirmationScenarioPlant || binding.Plant || binding.WorkOrderHeader?.PlanningPlant;
                    orderType = binding.ConfirmationScenarioOrderType || binding.OrderType || binding.WorkOrderHeader?.OrderType;
                    break;
            }
        }
        return { plant, orderType };
    }

    /**
     * Remove any dashes and uppercase the GUID
     * QRCodeStorage and QRCodeConfScenarios tables keep GUID in the incorrect format (42010aef-4d5f-1fd0-96e3-c38c51b5f36e), so we need to fix it
     * GUID needs to be a 32 character uppercase hex string without dashes (42010AEF4D5F1FD096E3C38C51B5F36E) for encrypt/decrypt functions
     * @param {*} guid 
     * @returns 
     */
    static formatGUID(guid) {
        if (typeof guid !== 'string') return '';
        return guid.replace(/-/g, '').toUpperCase();
    }

    /**
     * Generate a new GUID in the format of 32 characters, lowercase alphanumeric hex, with dashes at positions 8, 13, 18, and 23
     * This is the format required for saving in the database, but needs to be formatted to 32 uppercase characters without dashes for encrypt/decrypt functions (formatGUID method)
     * @returns 
     */
    static generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Repopulate the segments on the confirmation create screen for the scenario control
     * This is done when user is adding an ad-hoc confirmation and selecting a new work order from the picker
     * Scenario authorization is based on work order plant and order type
     * @param {*} context 
     * @param {*} plant - Current WO plant
     * @param {*} orderType - Current WO order type
     */
    static async confirmationScenariosSegmentsRedraw(context, plant, orderType) {
        let segments = [];
        
        segments.push({
            'DisplayValue': context.localizeText('scenario_none'),
            'ReturnValue': 'None',
        });
    
        if (await CooperationIsEnabledForWorkOrder(context, plant, orderType)) {
            segments.push({
                'DisplayValue': context.localizeText('scenario_support'),
                'ReturnValue': 'Support',
            });
        }
    
        if (await DoubleCheckIsEnabledForWorkOrder(context, plant, orderType)) {
            segments.push({
                'DisplayValue': context.localizeText('scenario_double_check'),
                'ReturnValue': 'DoubleCheck',
            });
        }
        
        let pageProxy = context;
        if (context.getPageProxy) pageProxy = context.getPageProxy();
        
        let scenarioControl = pageProxy.getControl('FormCellContainer').getControl('ScenarioSeg');
        await scenarioControl.setSegments(segments);
       
        return '';
    }

    /**
     * Post the newly generated dynamic QRCode to the backend online store
     * @param {*} context 
     * @param {*} scanObject 
     */
    static async postQRCodeStorageToOnlineStore(context, qrCodeObject) {
        try {
            const textStorage = await libThis.getTextStorage(context); //Get where the long text should be stored

            await ODataLibrary.initializeOnlineService(context);
            return await context.executeAction({
                'Name': '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeStorageGenericPost.action', 'Properties': {
                    'Target': {
                        'Service': '/SAPAssetManager/Services/OnlineAssetManager.service',
                        'Path': '/QRCodeStorage',
                        'RequestProperties': {
                            'Method': 'POST',
                            'Body': {
                                'GUID': qrCodeObject.GUID, //Randomly generated GUID
                                'Type': qrCodeObject.QRCODE_TYPE, //Scenario type
                                'User': qrCodeObject.UserID, //Current user
                                'Value': qrCodeObject.QRCode, //Encrypted QR Code value
                                'HashValue': qrCodeObject.HashValue, //SHA-256 hash of the QR Code value
                                'LongText': textStorage === 'DB' ? qrCodeObject.LONG_TEXT: '', //Long text comment if configured for DB
                            },
                        },
                    },
                },
            });
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(),'ERROR - Failed to post QR Code to online store in postQRCodeStorageToOnlineStore: ' + error);
            context.getClientData().Error = context.localizeText('qr_code_posting_failed');
            await context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
            return false; //Return false if the post failed
        }    
    }

    /**
     * Valid QR Code was scanned, so navigate to create confirmation screen or update current confirmation
     * @param {*} context 
     * @param {*} scanObject - The scan object containing the QR Code data
     */
    static async processConfirmation(context, scanObject) {
        let qrCodeObject = scanObject.QRCodeProperties;
        let params = {};
        const pageName = libCom.getPageName(context);
        const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
        const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();
        const currentScenario = libCom.getStateVariable(context, 'ConfirmationScenario');
        let employee = qrCodeObject.PERNR.toString();
    
        //Set some parameters and pass to the confirmation create script
        if (employee.length < 8) {
            employee = employee.padStart(8, '0'); //Pad the employee number to 8 digits
        }
        params.ConfirmationScenarioPersonnelNumber = employee;
        params.ConfirmationScenarioNote = qrCodeObject.LONG_TEXT;
        params.ConfirmationScenarioType = qrCodeObject.Type;
        if (currentScenario === coopScenario) { //Cooperation scan was chosen
            params.ConfirmationScenarioFeature = 'Support';
            params.isCooperation = true;
        } else if (currentScenario === doubleScenario) { //Double check scan was chosen
            params.ConfirmationScenarioFeature = 'DoubleCheck';
            params.isDoubleCheck = true;
        }
    
        switch (pageName) {
            case 'WorkOrderOperationDetailsPage':
            case 'WorkOrderOperationDetailsWithObjectCards':
                return ConfirmationCreateFromOperation(context, params);
            case 'WorkOrderDetailsWithObjectCardsPage':
            case 'WorkOrderDetailsPage':
                return ConfirmationCreateFromWONav(context, params);
            case 'SubOperationDetailsPage':
            case 'SubOperationDetailsClassicPage':
                return ConfirmationCreateFromSuboperation(context, params);
            case 'ConfirmationsCreateUpdatePage': //Scan was initiated from the confirmation screen, so update the screen fields
                params.DisableOrderFields = true; //Disable the order picker and operation number fields
                return await confirmationScenarioSetup(context, params);
            default:
                return ''; //Unsupported screen
        }
    }
    
    /**
     * Process record creation for QRCodeStrage and scan logging
     * @param {*} context 
     * @param {*} scanObject 
     */
    static async processRecordCreation(context, scanObject) {
        switch (scanObject.DecryptMethod) {
            case 'Online':
                return await libThis.processOnlineUseCase(context, scanObject);
            case 'Offline':
                return await libThis.processOfflineUseCase(context, scanObject);
            case 'OfflineDynamicPass':
                return await libThis.processOfflineDynamicPassUseCase(context, scanObject);
            default:
                return ''; //No record creation needed for other use cases
        }
    }
    
    /**
     * QRCode was found using online store, so log the scan
     * @param {*} context 
     * @param {*} scanObject 
     */
    static async processOnlineUseCase(context, scanObject) {
        return await libThis.createQRCodeLog(context, scanObject);
    }
    
    /**
     * QRCode was found using offline store, so log the scan
     * @param {*} context 
     * @param {*} scanObject 
     */
    static async processOfflineUseCase(context, scanObject) {
        return await libThis.createQRCodeLog(context, scanObject);
    }
    
    /**
     * QRCode was decrypted using offline passcode, so create a new QRCodeStorage record and log the scan
     * @param {*} context 
     * @param {*} scanObject 
     */
    static async processOfflineDynamicPassUseCase(context, scanObject) {
        await libThis.createQRCodeStorage(context, scanObject);
        return await libThis.createQRCodeLog(context, scanObject);
    }
    
    /**
     * 
     * @param {*} counterStr - The current counter string
     * @param {*} length - The desired length of the counter string (default is 8)
     * @returns 
     */
    static incrementCounter(counterStr, length = 8) {
        // Convert to number, add 1
        let newCount = parseInt(counterStr, 10) + 1;
    
        // Pad with leading zeros to ensure correct digits
        return newCount.toString().padStart(length, '0');
    }

    /**
     * Check if the app is not in demo mode
     * @param {*} context 
     * @returns 
     */
    static isNotDemoMode(context) {
        return !context.isDemoMode();
    }

    /**
     * Is there a network connection and is the app not in demo mode?
     * @param {*} context 
     * @returns 
     */
    static isOnlineMode(context) {
        return libNetwork.isNetworkConnected(context) && libThis.isNotDemoMode(context);
    }
    
    /**
     * Log a record for the scanned QR Code
     * @param {*} context 
     * @param {*} scanObject 
     * @returns 
     */
    static async createQRCodeLog(context, scanObject) {
        const currentScenario = libCom.getStateVariable(context, 'ConfirmationScenario');
        const row = await context.read('/SAPAssetManager/Services/AssetManager.service', 'QRCodeLogs', ['Counter'], '$top=1&$orderby=Counter desc');
        const counter = row.getItem(0) ? libThis.incrementCounter(row.getItem(0).Counter) : '00000001'; //Increment the last counter or start from 1
        const userID = libCom.getSapUserName(context); //Get the current user's ID
        const isOnChangeSet = libCom.isOnChangeset(context); //Check if we are in a changeset

        if (isOnChangeSet) {
            libCom.incrementChangeSetActionCounter(context); //Increment the changeset action counter
        }
    
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 'Properties': {
                'Target':
                {
                    'EntitySet' : 'QRCodeLogs',
                    'Service' : '/SAPAssetManager/Services/AssetManager.service',
                },
                'Properties':
                {
                    'GUID' : scanObject.Guid,
                    'ConfScenario' : currentScenario,
                    'Counter' : counter,
                    'ConsumedBy' : userID,
                    'ConsumedOnDate' : ServerCurrentDate(context),
                    'ConsumedOnTime' : ServerCurrentTime(context),
                },
            },
        });
    }

    /**
     * Create a new QRCodeStorage record after a scan
     * This is done when an offline QR Code is successfully decrypted with the static SAM default passcode
     * In order to log this scan, we need to create a record in the QRCodeStorage table
     * @param {*} context 
     * @param {*} scanObject 
     * @returns 
     */
    static async createQRCodeStorage(context, scanObject) {
        const textStorage = await libThis.getTextStorage(context); //Get where the long text should be stored
        const guid = libThis.generateGUID();
        const pass = libThis.formatGUID(guid); //Format the GUID for encryption/decryption
        const value = 'D' + libCrypto.encryptAESWrapper(context, JSON.stringify(scanObject.QRCodeProperties), pass); //Encrypt the data using AES-256
        const hashValue = libCrypto.hash256Base64(context, value); //Hash the QR Code to a base64 SHA-256 string
        const userID = libCom.getSapUserName(context); //Get the current user's ID
        const isOnChangeSet = libCom.isOnChangeset(context); //Check if we are in a changeset

        if (isOnChangeSet) {
            libCom.incrementChangeSetActionCounter(context); //Increment the changeset action counter
        }

        scanObject.Guid = guid; //Save the new GUID in the scan object for logging later

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 'Properties': {
                'Target':
                {
                    'EntitySet' : 'QRCodeStorage',
                    'Service' : '/SAPAssetManager/Services/AssetManager.service',
                },
                'Properties':
                {
                    'GUID' : guid,
                    'Type' : scanObject.QRCodeProperties.QRCODE_TYPE,
                    'User' : scanObject.QRCodeProperties.USER_NAME || userID, //Use the user name from the scan object or the current user
                    'Value' : value,
                    'HashValue' : hashValue,
                    'LongText' : textStorage === 'DB' ? scanObject.QRCodeProperties.LONG_TEXT: '',
                },
            },
        });
    }
    
    /**
     * Convert a JS Date → numeric YYYYMMDDHHMMSS in UTC
     * Used to create the CREATED_ON timestamp embedded in dynamic QR-Codes
     * @param {Date} date
     * @returns {number} e.g. 20250925183045
     */
    static dateToUtcNumber(date) {
        const pad = (n) => String(n).padStart(2, '0');
        const year = date.getUTCFullYear();
        const month = pad(date.getUTCMonth() + 1); // 0-based
        const day = pad(date.getUTCDate());
        const hour = pad(date.getUTCHours());
        const min = pad(date.getUTCMinutes());
        const sec = pad(date.getUTCSeconds());
        return Number(`${year}${month}${day}${hour}${min}${sec}`);
    }

    /**
     * Convert numeric YYYYMMDDHHMMSS (UTC) to JS Date in local time
     * Optionally adds seconds before returning
     * This is used to figure out from/to validity using the CREATED_ON UTC timestamp embedded in dynamic QR-Codes
     * @param {number|string} utcNumber - e.g. 20250925183045
     * @param {number} [secondsToAdd=0]
     * @returns {Date} JS Date object in local timezone
     */
    static utcNumberToDate(utcNumber, secondsToAdd = 0) {
        const str = String(utcNumber).padStart(14, '0');
        const year = parseInt(str.slice(0, 4), 10);
        const month = parseInt(str.slice(4, 6), 10) - 1; // JS months are 0-based
        const day = parseInt(str.slice(6, 8), 10);
        const hour = parseInt(str.slice(8, 10), 10);
        const min = parseInt(str.slice(10, 12), 10);
        const sec = parseInt(str.slice(12, 14), 10);

        // Construct as UTC first
        let d = new Date(Date.UTC(year, month, day, hour, min, sec));

        if (secondsToAdd) {
            d = new Date(d.getTime() + secondsToAdd * 1000);
        }

        // Returned Date auto-adjusts to local timezone
        return d;
    }

    /**
     * Verification (double-check) is globally authorized via app param
     * @param {*} context 
     * @returns 
     */
    static getDoubleCheckGlobalAuthorization(context) {
        return libCom.getAppParam(context, 'CONFIRMATION_SCENARIOS', 'EnableMaintJobVerification') === 'X';
    }
}
