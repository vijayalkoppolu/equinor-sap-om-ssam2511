import { TagStates } from '../libWCMDocumentItem';
import libCommmon from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default function SetTaggedNav(context) {
    return processSetTaggedUntaggedNav(context, TagStates.SetTagged);
}


export async function processSetTaggedUntaggedNav(context, taggingState) {
    context.getPageProxy().setActionBinding({ ...(context.binding || context.getPageProxy().getActionBinding()), taggingState });
    try {
        await context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/SetTaggedNav.action');

        if (libCommmon.getPageName(context) === 'OperationalItemDetailsPage') {
            return context.getPageProxy().executeCustomEvent('RedrawOperationalItemDetailsPage', true);
        }

        return Promise.resolve();
    } catch (err) {
        Logger.error('processSetTaggedUntaggedNav error:', err);
        return Promise.resolve();
    }
}
