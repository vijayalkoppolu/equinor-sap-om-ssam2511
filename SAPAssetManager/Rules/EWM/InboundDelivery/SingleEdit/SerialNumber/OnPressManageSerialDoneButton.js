import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import { ValidateSerialQuantity } from './IBDSerialNumberLib';
import { compareSerialNumberMaps } from './IBDSerialNumberOnBack';

export default function OnPressManageSerialDoneButton(context) {
    const quantityFieldControl = context.evaluateTargetPath('#Page:-Current/#Control:ToConfirmQuantity');

    return ValidateSerialQuantity(context).then(isValid => {
        if (!isValid) {
            CommonLibrary.executeInlineControlError(context, quantityFieldControl, context.localizeText('accept_all_error'));
            return Promise.reject();
        } else {
            if (!compareSerialNumberMaps(context)) {
                CommonLibrary.setStateVariable(context, 'IBDSerialsChanged', true);
            }
            return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
        }
    });
}
