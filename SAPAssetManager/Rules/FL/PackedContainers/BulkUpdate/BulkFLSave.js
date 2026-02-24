
import libCom from '../../../Common/Library/CommonLibrary';
/**
* This function is called when the user taps on the Save button in the Bulk Edit page for FL.
* @param {IClientAPI} clientAPI
*/

export default function BulkFLSave(context) {
    libCom.setStateVariable(context, 'BulkUpdateFinalSave', true);
    return context.executeAction('/SAPAssetManager/Actions/FL/PackContainers/BulkFLPackChangeset.action')
        .then(() => context.executeAction('/SAPAssetManager/Actions/FL/Edit/DocumentCreateSuccessWithClose.action'));
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
