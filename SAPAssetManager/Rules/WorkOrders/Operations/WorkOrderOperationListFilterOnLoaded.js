import filterOnLoaded from '../../Filter/FilterOnLoaded';
import libCom from '../../Common/Library/CommonLibrary';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import FastFiltersHelper from '../../FastFilters/FastFiltersHelper';

export default function WorkOrderOperationListFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');
    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    if (IsPhaseModelEnabled(context)) {
        const pageName = context.evaluateTargetPathForAPI('#Page:-Previous');
        const filters = PhaseLibrary.getFiltersFromPage(context, pageName);
        PhaseLibrary.setPhaseControlFilterValue(context, 'WorkOrderOperationsFilterPage', filters);
        PhaseLibrary.setPhaseControlKeyFilterValue(context, 'WorkOrderOperationsFilterPage', filters);
    }

    let clientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    let scheduledEarliestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateSwitch');
    let scheduledEarliestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateSwitch');
    let scheduledLatestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateSwitch');
    let scheduledLatestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateSwitch');

    const schedEarliestStartDate = FastFiltersHelper.getAppliedDateFilterValueFromContext(context, 'SchedEarliestStartDate');
    const schedEarliestEndDateFilter = FastFiltersHelper.getAppliedDateFilterValueFromContext(context, 'SchedEarliestEndDate');
    const schedLatestStartDateFilter = FastFiltersHelper.getAppliedDateFilterValueFromContext(context, 'SchedLatestStartDate');
    const schedLatestEndDateFilter = FastFiltersHelper.getAppliedDateFilterValueFromContext(context, 'SchedLatestEndDate');

    if (schedEarliestStartDate.length) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateEndFilter');

        scheduledEarliestStartDateSwitch.setValue(Boolean(schedEarliestStartDate.length));
        startDateControl.setValue(new Date(schedEarliestStartDate[0]));
        endDateControl.setValue(new Date(schedEarliestStartDate[1]));

        startDateControl.setVisible(Boolean(schedEarliestStartDate.length));
        endDateControl.setVisible(Boolean(schedEarliestStartDate.length));
    }

    if (schedEarliestEndDateFilter.length) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateEndFilter');

        scheduledEarliestEndDateSwitch.setValue(Boolean(schedEarliestEndDateFilter.length));
        startDateControl.setValue(new Date(schedEarliestEndDateFilter[0]));
        endDateControl.setValue(new Date(schedEarliestEndDateFilter[1]));

        startDateControl.setVisible(Boolean(schedEarliestEndDateFilter.length));
        endDateControl.setVisible(Boolean(schedEarliestEndDateFilter.length));
    }

    if (schedLatestStartDateFilter.length) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateEndFilter');

        scheduledLatestStartDateSwitch.setValue(Boolean(schedLatestStartDateFilter.length));
        startDateControl.setValue(new Date(schedLatestStartDateFilter[0]));
        endDateControl.setValue(new Date(schedLatestStartDateFilter[1]));

        startDateControl.setVisible(Boolean(schedLatestStartDateFilter.length));
        endDateControl.setVisible(Boolean(schedLatestStartDateFilter.length));
    }

    if (schedLatestEndDateFilter.length) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateEndFilter');

        scheduledLatestEndDateSwitch.setValue(Boolean(schedLatestEndDateFilter));
        startDateControl.setValue(new Date(schedLatestEndDateFilter[0]));
        endDateControl.setValue(new Date(schedLatestEndDateFilter[1]));

        startDateControl.setVisible(Boolean(schedLatestEndDateFilter));
        endDateControl.setVisible(Boolean(schedLatestEndDateFilter));
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }

    if (clientData.OperationFastFiltersClass) {
        clientData.OperationFastFiltersClass.resetClientData(context);
        clientData.OperationFastFiltersClass.setFastFilterValuesToFilterPage(context);
    }
}

