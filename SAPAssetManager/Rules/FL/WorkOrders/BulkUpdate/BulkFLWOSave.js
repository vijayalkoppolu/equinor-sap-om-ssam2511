import BulkFLWOValidate from './BulkFLWOValidate';
import libCom from '../../../Common/Library/CommonLibrary';
/**
* Saves the changes made in the Bulk Update screen for FL Work Orders.
* @param {IClientAPI} clientAPI
*/

export default function BulkFLWOSave(context) {
    libCom.setStateVariable(context, 'BulkFLUpdateNav', false);
    libCom.setStateVariable(context, 'BulkUpdateFinalSave', true);
    return BulkFLWOValidate(context).then((validationResult) => {
        if (!validationResult) {
            return undefined;
        }
  
        return context.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/BulkUpdate/FLBulkWOChangeset.action')   
        .then(() => context.executeAction('/SAPAssetManager/Actions/FL/Edit/DocumentCreateSuccessWithClose.action'));
    });
}

export function getUpdatedItemsFromEDT(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let itemsArray = [];
    for (let index = 2; index < sections.length; index += 2) {
        let section = sections[index];
        itemsArray.push(section.getExtension()?.getAllValues()[0]);
    }
    return itemsArray;
}
