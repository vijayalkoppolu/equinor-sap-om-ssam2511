import { GetEDTControls } from '../../BulkUpdate/BulkUpdateLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
export default async function BulkFLReadyToPackValidate(context) {
    if (!libCom.getStateVariable(context, 'BulkUpdateFinalSave')) {
        /* Workaround for the context to refer to the current EDT page instead of the previous page for the
           validation message to be displayed on the current EDT page */
        await libCom.sleep(500);
    }
    const EDTControls = GetEDTControls(context);

    if (ValidationLibrary.evalIsEmpty(EDTControls[0]?.getAllValues()[0]?.Properties)) {
        return Promise.resolve(true);
    }
    const selectedItemsEDTControls = EDTControls.filter(control => (control));
    if (selectedItemsEDTControls.length === 0) {
        context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('no_items_selected'),
                'Duration': 7,
                'Animated': true,
                '_Type': 'Action.Type.BannerMessage',
            },
        });
        return Promise.resolve(false);
    }
    let selectedItemsEDTControlsItem;
    if (libCom.getStateVariable(context, 'BulkUpdateFinalSave')) {
        selectedItemsEDTControlsItem = selectedItemsEDTControls;
    } else {
        selectedItemsEDTControlsItem = EDTControls.filter(control => (control) && control.getAllValues()[0].OdataBinding['@odata.readLink'] === context.binding['@odata.readLink']);
    }

    let validationResult = [];
    selectedItemsEDTControlsItem.forEach(async control => {
        validationResult.push(validateItem(context, control));
    }); 
   
    return Promise.all(validationResult).then(results => {
        return results.every(result => result);
    });
}
function validateItem(context, control) {
    const item = control.getAllValues()?.[0];

        let receivingPoint = validateReceivingPoint(context, item.OdataBinding, control.getRowCellByName(0, 'ReceivingPointListPkr'), item.Properties.ReceivingPoint);

        return Promise.all([receivingPoint]).then((recValid) => {
            let isValid = true;
            isValid &= recValid[0];
            return isValid ? Promise.resolve(true) : Promise.resolve(false);
        });
}
function validateReceivingPoint(context, binding, control, receivingPoint) {
    if (ValidationLibrary.evalIsEmpty(receivingPoint)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}



