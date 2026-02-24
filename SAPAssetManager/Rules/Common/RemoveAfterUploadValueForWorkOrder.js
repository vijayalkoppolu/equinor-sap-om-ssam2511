import IsUploadOnlyPersonalized from '../UserPreferences/IsUploadOnlyPersonalized';
import { GlobalVar as globals } from '../Common/Library/GlobalCommon';
import libCommon from '../Common/Library/CommonLibrary';

export default function RemoveAfterUploadValueForWorkOrder(context) {
    if (IsUploadOnlyPersonalized(context)) {
        // RemoveAfterUploadForBatch value will always be true when creating a WorkOrder with changeset. This will be false outside the changeset
        if (libCommon.getStateVariable(context, 'RemoveAfterUploadForBatch') === true) {
            // RemoveAfterUploadValue should always be true except when the WORKORDER.AutoRelease is 'Y'
            return globals.getAppParam().WORKORDER.AutoRelease === 'N';
        }
    }

    return true;
}
