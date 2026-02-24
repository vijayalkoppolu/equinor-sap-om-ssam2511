import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FormTemplateOnValueChange(context) {
    const pageProxy = context.getPageProxy();
    const formValue = CommonLibrary.getControlProxy(pageProxy, 'SDFFormInstanceCreateListPicker')?.getValue()[0]?.BindingObject;
    const appNameInstanceControl = CommonLibrary.getControlProxy(pageProxy, 'SDFFormInstanceAppNameListPicker');
    const appNameValue = CommonLibrary.getControlProxy(pageProxy, 'SDFFormInstanceAppNameListPicker')?.getValue()[0];
    if (!appNameValue) {
        appNameInstanceControl.setValue(formValue.AppName);
        appNameInstanceControl.redraw();
    }
}
