/**
* Describe this function...
* @param {IClientAPI} context
*/
import DownloadDefiningRequest from '../OData/Download/DownloadDefiningRequest';
import libCom from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function PerformAppUpdateCheck(context) {
    // skip app update check if in demo mode or not initial sync
    if (!libCom.isInitialSync(context) || context.isDemoMode()) {
        /**
         * App update is somehow called in the middle of a user switch sync. If the user switch sync is still in 
         * progress or it never completed because of an error or the network going out, we do not want to perform an app update.
         */
        const userSwitchDeltaCompleted =  ApplicationSettings.getBoolean(context, 'didUserSwitchDeltaCompleted', true);
        if (userSwitchDeltaCompleted === false) {
            return Promise.resolve();
        } else {
            return DownloadDefiningRequest(context);  
        }          
    } else if (libCom.isInitialSync(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Common/PerformAppUpdateCheck.action');
    }
}

