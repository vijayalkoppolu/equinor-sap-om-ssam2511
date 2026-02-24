
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function AssignToVoyageOnDocumentSelectedOrUnselected(context) {
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding);
    let enableAssignToVoyageButton = selectedItems.length > 0;

    if (selectedItems.length > 1 || selectedItems.length === 0) {
        enableAssignToVoyageButton = false;
    } else {
        enableAssignToVoyageButton = true;
    }

    if (selectedItems.length > 0) {
        CommonLibrary.setStateVariable(context, 'AssignToVoyageSelectedVoyage', selectedItems[0]);
    } else {
        CommonLibrary.setStateVariable(context, 'AssignToVoyageSelectedVoyage', null);
    }

    const page = CommonLibrary.getPageName(context);
    return CommonLibrary.enableToolBar(context, page, 'FLAssignToVoyageButton', enableAssignToVoyageButton);
}
