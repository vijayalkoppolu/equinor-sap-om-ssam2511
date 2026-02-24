import libCom from '../../Common/Library/CommonLibrary';

export default async function FormRunnerNav(context) {
    // do not load into a modal window
    if (context.currentPage.isModal()) {
        // close the modal and set ActionBinding
        const pageProxy = context.getPageProxy();
        const formCellContainer = pageProxy.getControl('FormCellContainer');
        const SDFFormInstance = formCellContainer.getControl('SDFFormInstanceCreateListPicker');
        const actionBinding = SDFFormInstance.getValue()[0].BindingObject;
        pageProxy.setActionBinding(actionBinding);
        pageProxy.getClientData().templateReadLink = actionBinding?.['@odata.readLink'];
        libCom.setStateVariable(context, 'ObjectCreatedName', 'DynamicFormInstance');
        return context.executeAction('/SAPAssetManager/Actions/Forms/SDF/FormInstanceCreate.action');
    }

    // check for creation rather than view
    if (context.getPageProxy()?.getActionBinding()?.['@odata.type'] === '#sap_mobile.DynamicFormTemplate') {
        context.getPageProxy().getClientData().templateReadLink = context.getPageProxy()?.getActionBinding()?.['@odata.readLink'];
        libCom.setStateVariable(context, 'ObjectCreatedName', 'DynamicFormInstance');
        return await context.executeAction('/SAPAssetManager/Actions/Forms/SDF/FormInstanceCreate.action');
    }
    
    return context.executeAction('/SAPAssetManager/Actions/Forms/SDF/FormRunnerNav.action');
}
