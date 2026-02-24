import filterOnLoaded from '../Filter/FilterOnLoaded';
import libCom from '../Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import PhaseLibrary from '../PhaseModel/PhaseLibrary';
import FastFiltersHelper from '../FastFilters/FastFiltersHelper';

export default function WorkOrderFilterOnLoaded(context) {
    let pageName = context.evaluateTargetPathForAPI('#Page:-Previous');
    let clientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    filterOnLoaded(context); //Run the default filter on loaded

    if (clientData.WOFastFiltersClass) {
        clientData.WOFastFiltersClass.resetClientData(context);
        clientData.WOFastFiltersClass.setFastFilterValuesToFilterPage(context);
    }

    let filter = libCom.getStateVariable(context, 'SupervisorAssignmentFilter');
    if (filter) { //Default the assigbnment filter values
        let formCellContainer = context.getControl('FormCellContainer');
        let assignControl = formCellContainer.getControl('AssignmentFilter');
        assignControl.setValue(filter);
        libCom.removeStateVariable(context, 'SupervisorAssignmentFilter');
    }

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');
    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    if (IsPhaseModelEnabled(context)) {
        const filters = PhaseLibrary.getFiltersFromPage(context, pageName);
        PhaseLibrary.setPhaseControlFilterValue(context, 'WorkOrderFilterPage', filters);
        PhaseLibrary.setPhaseControlKeyFilterValue(context, 'WorkOrderFilterPage', filters);
    }

    let reqDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:RequestStartDateSwitch');
    let dueDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueDateSwitch');
    const reqDateFilter = FastFiltersHelper.getAppliedDateFilterValueFromContext(context, 'RequestStartDate');
    const dueDateFilter = FastFiltersHelper.getAppliedDateFilterValueFromContext(context, 'DueDate');

    if (reqDateFilter.length) {
        let reqStartDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqStartDateFilter');
        let reqEndDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqEndDateFilter');

        reqDateSwitch.setValue(Boolean(reqDateFilter.length));
        reqStartDateControl.setValue(new Date(reqDateFilter[0]));
        reqEndDateControl.setValue(new Date(reqDateFilter[1]));

        reqStartDateControl.setVisible(reqDateFilter.length);
        reqEndDateControl.setVisible(reqDateFilter.length);
    }

    if (dueDateFilter.length) {
        let dueStartDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueStartDateFilter');
        let dueEndDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueEndDateFilter');

        dueDateSwitch.setValue(Boolean(dueDateFilter.length));
        dueStartDateControl.setValue(new Date(dueDateFilter[0]));
        dueEndDateControl.setValue(new Date(dueDateFilter[1]));

        dueStartDateControl.setVisible(dueDateFilter.length);
        dueEndDateControl.setVisible(dueDateFilter.length);
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }

    if (clientData && clientData.OrderProcessingContext) {
        let emergencySwitch = context.getControl('FormCellContainer').getControl('EmergencySwitch');
        emergencySwitch.setValue(clientData.OrderProcessingContext);
    }
}
