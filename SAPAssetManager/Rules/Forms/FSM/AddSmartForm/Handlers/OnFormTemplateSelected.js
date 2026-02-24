import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function OnFormTemplateSelected(context) {
    const template = context.binding.FSMFormTemplate_Nav || context.binding;
    AddSmartFormLibrary.updateSelectedTemplate(context, template);
    return context.executeAction('/SAPAssetManager/Actions/Forms/NavBackToAddSmartFormPage.action');
}
