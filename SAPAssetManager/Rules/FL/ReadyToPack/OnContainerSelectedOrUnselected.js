import CommonLibrary from '../../Common/Library/CommonLibrary';
export default function OnContainerSelectedOrUnselected(context) {
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const itemCount = section.getSelectedItemsCount();
    const page = CommonLibrary.getPageName(context);
    if (itemCount > 1 || itemCount === 0) {
        CommonLibrary.enableToolBar(context, page, 'AssignToContainerPKGButton', false, 'Text');
    } else {
        CommonLibrary.enableToolBar(context, page, 'AssignToContainerPKGButton', true, 'Text');
    }
}
