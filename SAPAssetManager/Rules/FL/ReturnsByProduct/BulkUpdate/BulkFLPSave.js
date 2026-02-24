import BulkFLPValidate from './BulkFLPValidate';
import libCom from '../../../Common/Library/CommonLibrary';


export default function BulkFLPSave(context) {
    libCom.setStateVariable(context, 'BulkFLUpdateNav', false);
    libCom.setStateVariable(context, 'BulkUpdateFinalSave', true);
    return BulkFLPValidate(context).then((validationResult) => {
        if (!validationResult) {
            return undefined;
        }

        return context.executeAction('/SAPAssetManager/Actions/FL/ReturnsByProduct/BulkUpdate/FLPReturnBulkChangeset.action')
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
