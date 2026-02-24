import Logger from '../Log/Logger';
import GenerateAssnTypeTable from './GenerateAssnTypeTable';
import assignmentType from './Library/AssignmentType';
import InitDefaultOverviewRows from '../Confirmations/Init/InitDefaultOverviewRows';
import InitDemoOverviewRows from '../TimeSheets/Demo/InitDemoOverviewRows';
import common from './Library/CommonLibrary';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';
import deviceRegistration from '../DigitalSignature/TOTPDeviceRegistration';
import removeHeader from '../ApplicationEvents/RemoveHeader';
import libPersona from '../Persona/PersonaLibrary';
import libCrew from '../Crew/CrewLibrary';
import MeterLib from '../Meter/Common/MeterLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import libLocationTracking from '../LocationTracking/LocationTrackingLibrary';
import libAutoSync from '../ApplicationEvents/AutoSync/AutoSyncLibrary';
import SetInitialIsAnythingStartedFlag from './SetInitialIsAnythingStartedFlag';


export function DeltaSyncInit(pageProxy) {
    return libLocationTracking.initService(pageProxy)
        .then(() => libAutoSync.autoSyncOnConnectionChange(pageProxy))
        .then(() => libAutoSync.autoSyncPeriodically(pageProxy))
        .then(() => SetInitialIsAnythingStartedFlag(pageProxy))
        .then(() => {
            let overviewPageName = libPersona.getPersonaOverviewStateVariablePage(pageProxy);
            let overviewPage = pageProxy.evaluateTargetPathForAPI('#Page:' + overviewPageName);
            if (overviewPage && overviewPage.getControls().length > 0) {
                overviewPage.getControls()[0].redraw();

                if (overviewPageName === 'InventoryOverview') {
                    let tabPageProxy;

                    try {
                        tabPageProxy = overviewPage.evaluateTargetPathForAPI('#Page:InboundOutboundListPage');
                    } catch (error) {
                        Logger.error('Inventory Overview', error);
                    }
                    let table = tabPageProxy ? tabPageProxy.getControl('SectionedTable') : null;
                    if (table) {
                        table.getSections()[0].redraw(true);
                    }
                }

                checkIsDemo(pageProxy, overviewPage);
            }
            return true;
        }).catch((err) => {
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global').getValue(), `Failed to initialize global states : ${err}`);
            return false;
        });
}

export default function InitializeGlobalStates(pageProxy) {


    /**** Instantiate global state variables *****/
    /* We will keep these small tables in memory for easy access, rather than reading from the offline store each time they are needed
    */

    return DeltaSyncInit(pageProxy).then(() => {
        // Remove User Switch Header if present
        removeHeader(pageProxy, 'UserSwitch');
        if (userFeaturesLib.isFeatureEnabled(pageProxy, pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Features/FOW.global').getValue())) {
            common.setStateVariable(pageProxy, 'isFOWRouteEnabled', true);
        } else {
            common.setStateVariable(pageProxy, 'isFOWRouteEnabled', false);
        }

        // Generate Workorder Control Defaults Table
        let WOAssnTypeTable = GenerateAssnTypeTable(pageProxy, 'WorkOrder');
        assignmentType.setWorkOrderAssignmentDefaults(WOAssnTypeTable);
        // Generate Notifications Control Defaults Table
        let NotifAssnTypeTable = GenerateAssnTypeTable(pageProxy, 'Notification');
        assignmentType.setNotificationAssignmentDefaults(NotifAssnTypeTable);
        if (libCrew.isCrewFeatureEnabled(pageProxy)) {
            libCrew.initializeCrewHeader(pageProxy);
        }
        //Initialized the overview rows promises
        let initOverviewRows = InitDefaultOverviewRows(pageProxy);
        let initDemoOverviewRows = InitDemoOverviewRows(pageProxy);
        let initializeMeterReaderFlagPromise = userFeaturesLib.isFeatureEnabled(pageProxy, pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) ? initializeMeterReaderFlag(pageProxy) : Promise.resolve(true);

        //let successMessage = pageProxy.executeAction('/SAPAssetManager/Actions/ApplicationStartupMessage.action');
        //create the 'Uninstalled" system status
        if (userFeaturesLib.isFeatureEnabled(pageProxy, pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], "$filter=SystemStatus eq 'LOC01'").then(result => {
                if (result && result.length === 0) {
                    pageProxy.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/SystemStatusUninstallCreate.action');
                }
            });
        }
        //Execute all promises and register for push afterwards
        return Promise.all([initOverviewRows, initDemoOverviewRows, initializeMeterReaderFlagPromise]).then(() => {
            return handleDigitalSignatureRegistration(pageProxy).then(() => {
                return handlePush(pageProxy);
            }).catch(() => {
                return handlePush(pageProxy);
            });
        }).catch(() => {
            return handleDigitalSignatureRegistration(pageProxy).then(() => {
                return handlePush(pageProxy);
            }).catch(() => {
                return handlePush(pageProxy);
            });
        });
    });
}

export function handlePush(context) {
    if (!context.isDemoMode()) {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationRegister.action').catch(() => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue(), 'Failed to register for Push notifications');
            return Promise.resolve(false);
        }).finally(() => {
            context.dismissActivityIndicator();
            return Promise.resolve(true);
        });
    } else {
        context.dismissActivityIndicator();
        return Promise.resolve(true);
    }
}

export function handleDigitalSignatureRegistration(context) {
    if (!context.isDemoMode() && libDigSig.isDigitalSignatureEnabled(context) && common.isInitialSync(context)) {
        return deviceRegistration(context).finally(() => {
            context.dismissActivityIndicator();
            return Promise.resolve(true);
        });
    } else {
        context.dismissActivityIndicator();
        return Promise.resolve(true);
    }
}
/**
 * set if we are Meter Reader or not
 * @param {*} context
 */
function initializeMeterReaderFlag(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'StreetRoutes', [], '$top=1').then(result => {
        if (result && result.length > 0) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PeriodicMeterReadings', [], '$top=1').then(PMR => {
                if (PMR && PMR.length > 0) {
                    MeterLib.setMeterReaderFlag(true);
                    return true;
                }
                MeterLib.setMeterReaderFlag(false);
                return false;
            });
        }
        MeterLib.setMeterReaderFlag(false);
        return false;
    });
}

function checkIsDemo(pageProxy, overviewPage) {
    if (!pageProxy.isDemoMode()) {
        const mapSection = overviewPage.getControls()[0].getSection('MapExtensionSection');
        const mapExtension = mapSection ? mapSection.getExtension() : null;
        if (mapExtension && !mapExtension.isInitialized()) {
            mapExtension.fetchConfig();
        }
    }
}
