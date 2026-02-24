import lib from '../LocationTracking/LocationTrackingLibrary';
import ApplicationSettings from './Library/ApplicationSettings';

export default function BeforeAppUpdate(context) {
    if (lib.isNetworkConnected(context)) {
        const userSwitchDeltaCompleted =  ApplicationSettings.getBoolean(context, 'didUserSwitchDeltaCompleted', true);
        if (userSwitchDeltaCompleted === false) {
            return context.executeAction('/SAPAssetManager/Actions/Common/AppUpdateIsNotPossible.action');
        }
        return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Common/PerformAppUpdateCheck.action');
    }

    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Common/ServiceUnavailable.action');
}
