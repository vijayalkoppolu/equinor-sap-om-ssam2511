import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function ResetAddSmartFormControls(resetButtonProxy) {
    const pageProxy = resetButtonProxy.getPageProxy();
  
    const responsiblePersonControl = AddSmartFormLibrary.getResponsiblePersonControl(pageProxy);
    const taskControl = AddSmartFormLibrary.getTaskControl(pageProxy);
    const descriptionControl = AddSmartFormLibrary.getDescriptionControl(pageProxy);
    const mandatoryControl = AddSmartFormLibrary.getMandatorySwitchControl(pageProxy);

    responsiblePersonControl.setValue(AddSmartFormLibrary.getPageDefaultValue(pageProxy, responsiblePersonControl.getName()));
    taskControl.setValue(AddSmartFormLibrary.getPageDefaultValue(pageProxy, taskControl.getName()));
    descriptionControl.setValue(AddSmartFormLibrary.getPageDefaultValue(pageProxy, descriptionControl.getName()));
    mandatoryControl.setValue(AddSmartFormLibrary.getPageDefaultValue(pageProxy, mandatoryControl.getName()));

    AddSmartFormLibrary.updateSelectedTemplate(pageProxy, null);
    AddSmartFormLibrary.getTemplateControl(pageProxy).redraw();

    AddSmartFormLibrary.setDoneActionBarButtonEnabled(pageProxy);

    resetButtonProxy.redraw();
}
