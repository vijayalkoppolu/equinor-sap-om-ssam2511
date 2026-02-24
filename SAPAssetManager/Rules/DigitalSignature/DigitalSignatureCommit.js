/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';
import ODataLibrary from '../OData/ODataLibrary';
import NetworkMonitoringLibrary from '../Common/Library/NetworkMonitoringLibrary';

export default async function DigitalSignatureCommit(context) {
    const logCategory = context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue();
    
    if (!libDigSig.isDigitalSignatureEnabled(context)) {
        Logger.debug(logCategory, 'Digital signatures are disabled.');
        return false;
    }

    if (!NetworkMonitoringLibrary.isNetworkConnected(context)) {
        Logger.debug(logCategory, 'No network connection.');
        return false;
    }

    try {
        await ODataLibrary.initializeOnlineService(context);
        let signatures = await context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], "$filter=PreferenceGroup eq 'DIG_SIG_SIGNKEY'");
        let errorEntities = await context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], '');
        if (signatures && signatures.length > 0) {
            Logger.debug(logCategory, 'Found ' + signatures.length + ' draft signatures');
            for (let i = 0; i<signatures.length; i++) {
                let signature = signatures.getItem(i);
                let name = signature.PreferenceName;
                let value = signature.PreferenceValue;
                
                let found = false;
                // check if this entity is in error archive
                if (errorEntities) {
                    for (let j = 0; j<errorEntities.length; j++) {
                        if (errorEntities.getItem(j).RequestURL === name) {
                            // this entity is in error, skip it
                            Logger.debug(logCategory, 'Entity ' + name + ' is in ErrorArchive. Skipping...');
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    let signatureParts = value.split('/');
                    if (signatureParts && signatureParts.length === 3) { // we know it was encoded as "Application/Object/SigningKey"
                        context.getClientData().SigningApplication = signatureParts[0];
                        context.getClientData().SigningApplicationSubObject = signatureParts[1];
                        context.getClientData().ApplicationObjectSignKey = signatureParts[2];
                        context.getClientData().SignatureReadLink = signature['@odata.readLink'];
                        Logger.debug(logCategory, 'Now saving signature for: ' + name);
                        try {
                            await context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/DigitalSignatureCommit.action');
                        } catch (error) {
                            Logger.error(logCategory, 'Got error in saving signature: ' + error);
                            await context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDraftSignatureFromUserPrefs.action');
                        }
                    }
                }
            }
        } else {
            Logger.debug(logCategory, 'No draft signatures found!');
            context.updateProgressBanner('No draft signatures found!');
        }
    } catch (error) {
        Logger.error(logCategory, 'Got error in DigitalSignatureCommit.action: ' + error);
    }
}
