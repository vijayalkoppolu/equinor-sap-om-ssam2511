import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function TemplateControlValue(context) {
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    if (sectionedTable) {
        AddSmartFormLibrary.getResetButton(context).redraw(); // redraw reset button to trigger Enabled button rule
        AddSmartFormLibrary.setDoneActionBarButtonEnabled(context);
    }

    const selectedTemplate = AddSmartFormLibrary.getSelectedTemplate(context);
    return selectedTemplate.Name || context.localizeText('none');
}
