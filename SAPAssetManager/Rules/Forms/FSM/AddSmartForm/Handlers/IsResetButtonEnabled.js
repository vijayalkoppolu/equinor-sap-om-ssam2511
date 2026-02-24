import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function IsResetButtonEnabled(context) {
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    if (!sectionedTable) return false; // initial page load. By default button is disabled

    const responsiblePersonControl = AddSmartFormLibrary.getResponsiblePersonControl(context);
    const taskControl = AddSmartFormLibrary.getTaskControl(context);
    const descriptionControl = AddSmartFormLibrary.getDescriptionControl(context);
    const mandatoryControl = AddSmartFormLibrary.getMandatorySwitchControl(context);
    
    const selectedTemplate = AddSmartFormLibrary.getSelectedTemplate(context).Name || '';
    const defaultValues = AddSmartFormLibrary.getPageDefaultValue(context);
    const controlsValues = {
        'ResponsiblePersonLstPkr': CommonLibrary.getControlValue(responsiblePersonControl),
        'TaskLstPkr': CommonLibrary.getControlValue(taskControl),
        'DescriptionNote': CommonLibrary.getControlValue(descriptionControl),
        'MarkAsMandatorySwitch': CommonLibrary.getControlValue(mandatoryControl),
        'TemplateLstPkr': selectedTemplate,
    };

    const isResetButtonEnabled = Object.keys(controlsValues).some(controlName => {
        return controlsValues[controlName] !== defaultValues[controlName];
    });

    return isResetButtonEnabled;
}
