import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FormFilterOnValueChange(context) {
    const pageProxy = context.getPageProxy();
    const filterValue = CommonLibrary.getControlProxy(pageProxy, 'SDFFormInstanceAppNameListPicker')?.getValue()[0]?.ReturnValue;
    const instanceControl = CommonLibrary.getControlProxy(pageProxy, 'SDFFormInstanceCreateListPicker');
    const select = '$select=AppName,FormName,FormVersion';
    const orderBy = '$orderby=AppName,FormName,FormVersion';
    let instanceCtrlSpecifier = instanceControl.getTargetSpecifier();
    if (filterValue) {
        instanceCtrlSpecifier.setQueryOptions(`${select}&${orderBy}&$filter=(AppName eq '${filterValue}') and Creatable eq 'X'`);
    } else {
        instanceCtrlSpecifier.setQueryOptions(`${select}&${orderBy}&$filter=Creatable eq 'X'`);
    }
    instanceControl.setTargetSpecifier(instanceCtrlSpecifier);
    instanceControl.redraw();
}
