import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import { SDF_ATTACHMENT_MAP_KEY, getAttachmentMap, setAttachmentMap} from './SubmissionHandler';
import Logger from '../../Log/Logger';

/**
 * remvoes the invalid readlinks in the attachment map from the application settings
 * removes the map itself if no entries exist
 * @param {*} context 
 */
export default async function CleanAttachmentCache(context) {
    const attachmentMap = getAttachmentMap(context);
    const newMap = {};
    let total = 0;
    let count = 0;
    Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), 'Validating attachment cache...');

    const entries = Object.entries(attachmentMap);

    for (const [key, readLink] of entries) {
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), `Validating attachment ${readLink}...`);
        try {
            const result = await context.count('/SAPAssetManager/Services/AssetManager.service', readLink);

            if (result === 1) {
                newMap[key] = readLink;
                count++;
                Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), `Validating attachment ${readLink}... FOUND!`);
            }
        } catch (e) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), `Error validating attachment: ${e}`);
        }
        total++;
    }

    if (count === 0) {
        ApplicationSettings.remove(context, SDF_ATTACHMENT_MAP_KEY);
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), 'Clearing attachment cache');
    } else {
        setAttachmentMap(context, newMap);
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), `Attachment cache cleaned ${total - count} old entries`);
    }
}
