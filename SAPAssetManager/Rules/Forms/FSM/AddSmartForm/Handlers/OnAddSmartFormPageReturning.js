import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function OnAddSmartFormPageReturning(context) {
    const descriptionControl = AddSmartFormLibrary.getDescriptionControl(context);
    const templateSection = AddSmartFormLibrary.getTemplateControl(context);
    const templateControlValue = templateSection._context.element.value.items[0].value;

    const selectedTemplate = AddSmartFormLibrary.getSelectedTemplate(context);
    const selectedTemplateName = selectedTemplate.Name || context.localizeText('none');

    if (selectedTemplateName !== templateControlValue) {
        descriptionControl.setValue(selectedTemplate.Description || '');
        templateSection.redraw();
    } else if (selectedTemplateName === context.localizeText('none')) {
        descriptionControl.setValue('');
        templateSection.redraw();
    }
}
