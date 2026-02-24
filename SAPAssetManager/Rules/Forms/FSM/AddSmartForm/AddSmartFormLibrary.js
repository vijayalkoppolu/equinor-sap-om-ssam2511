import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default class AddSmartFormLibrary {
    
    static updateSelectedTemplate(context, selectedTemplate = null) {
        const clientData = context.evaluateTargetPathForAPI('#Page:AddSmartFormPage').getClientData();
        clientData.selectedFormTemplate = selectedTemplate; 
    }

    static resetPageDefaultValues(context) {
        const clientData = context.getPageProxy().getClientData();
        const responsiblePersonControl = AddSmartFormLibrary.getResponsiblePersonControl(context);
        const taskControl = AddSmartFormLibrary.getTaskControl(context);

        clientData.defaultValues = {
            ResponsiblePersonLstPkr: CommonLibrary.getControlValue(responsiblePersonControl),
            TemplateLstPkr: '',
            TaskLstPkr: CommonLibrary.getControlValue(taskControl),
            DescriptionNote: '',
            MarkAsMandatorySwitch: false,
        };
    }

    static getPageDefaultValue(context, property) {
        const clientData = context.getPageProxy().getClientData();
        return property ? clientData.defaultValues[property] : clientData.defaultValues;
    }

    static getSelectedTemplate(context) {
        const clientData = context.getPageProxy().getClientData();
        return clientData.selectedFormTemplate || {};
    }

    static getResponsiblePersonControl(context) {
        const pageProxy = context.getPageProxy();
        const sectionedTable = pageProxy.getControl('SectionedTable');
        return sectionedTable.getSection('Section1').getControl('ResponsiblePersonLstPkr');
    }

    static getTemplateControl(context) {
        const pageProxy = context.getPageProxy();
        const sectionedTable = pageProxy.getControl('SectionedTable');
        return sectionedTable.getSection('Section2');
    }

    static getTaskControl(context) {
        const pageProxy = context.getPageProxy();
        const sectionedTable = pageProxy.getControl('SectionedTable');
        return sectionedTable.getSection('Section3').getControl('TaskLstPkr');
    }

    static getDescriptionControl(context) {
        const pageProxy = context.getPageProxy();
        const sectionedTable = pageProxy.getControl('SectionedTable');
        return sectionedTable.getSection('Section3').getControl('DescriptionNote');
    }

    static getMandatorySwitchControl(context) {
        const pageProxy = context.getPageProxy();
        const sectionedTable = pageProxy.getControl('SectionedTable');
        return sectionedTable.getSection('Section3').getControl('MarkAsMandatorySwitch');
    }

    static getResetButton(context) {
        const pageProxy = context.getPageProxy();
        return pageProxy.getControl('SectionedTable').getSection('Buttons');
    }

    static setDoneActionBarButtonEnabled(context) {
        const pageProxy = context.getPageProxy();
        const responsiblePersonControl = AddSmartFormLibrary.getResponsiblePersonControl(context);
        const responsiblePerson = CommonLibrary.getControlValue(responsiblePersonControl);
        const template = pageProxy.getClientData().selectedFormTemplate;

        const isEnabled = !!(responsiblePerson && template);
        pageProxy.getActionBar().getItem('Done').setEnabled(isEnabled);
    }
}
