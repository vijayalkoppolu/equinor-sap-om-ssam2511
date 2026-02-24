import CommonLibrary from '../Common/Library/CommonLibrary';

export default async function SubmitGeometryToDeletion(context) {
    const userConfirmDeletion = await context.executeAction('/SAPAssetManager/Actions/DiscardLocationWarningMessage.action').then(result => result.data);
    
    if (userConfirmDeletion) {
        clearLocationFields(context);
        CommonLibrary.setStateVariable(context, 'GeometryObjectType', '');
        context.getPageProxy().getClientData().GeometrySubmitDeletion = true;
    }

    return Promise.resolve();
}

function clearLocationFields(context) {
    context.getSection?.('LocationButtonsSection')?.redraw();
    const control = context.getControl('LocationEditTitle');
    if (control) {
        control.setValue('');
        control.getPageProxy().currentPage.editModeInfo = {};
        control.redraw();
    }
}
