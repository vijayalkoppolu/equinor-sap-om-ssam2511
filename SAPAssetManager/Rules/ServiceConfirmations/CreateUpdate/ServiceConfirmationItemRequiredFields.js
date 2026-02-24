import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsItemFieldEditable from './Handlers/IsItemFieldEditable';

export default function ServiceConfirmationItemRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'ItemCategoryLstPkr',
        'QuantitySimple',
    ];

    if (CommonLibrary.getPageName(context) === 'CreateServiceHocConfirmationItemScreen') {
        requiredFields.push('ProductIdLstPkr');
    } else {
        if (IsItemFieldEditable(context)) {
            requiredFields.push('ServiceItemListPicker');
        } else {
            requiredFields.push('ServiceItemProperty');
        }
    }

    const amountControl = CommonLibrary.getControlProxy(context, 'AmountProperty');
    if (amountControl.getVisible()) {
        requiredFields.push('AmountProperty');
    }

    return requiredFields;
}
