import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { NotificationItemRequiredFields } from '../../CreateUpdate/RequiredFields';
import NotificationLibrary from '../../NotificationLibrary';

export default function NotificationItemCreateUpdateDonePressed(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const requiredFields = NotificationItemRequiredFields(formCellContainer);
    const charLimitFields = { ItemDescription: parseInt(CommonLibrary.getAppParam(context, 'NOTIFICATION', 'DescriptionLength')) };
    const isValid = NotificationLibrary.Validate(context, formCellContainer, requiredFields, charLimitFields);
    return isValid ? context.executeAction('/SAPAssetManager/Rules/Notifications/Item/CreateUpdate/NotificationItemCreateUpdateOnCommit.js') : '';
}
