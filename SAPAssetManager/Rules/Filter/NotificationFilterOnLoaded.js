import filterOnLoaded from '../Filter/FilterOnLoaded';
import libCom from '../Common/Library/CommonLibrary';
import FastFiltersHelper from '../FastFilters/FastFiltersHelper';

export default function NotificationFilterOnLoaded(context) {
    let clientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    filterOnLoaded(context); //Run the default filter on loaded
    if (clientData.NotificationFastFiltersClass) {
        clientData.NotificationFastFiltersClass.resetClientData(context);
        clientData.NotificationFastFiltersClass.setFastFilterValuesToFilterPage(context);
    }

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');

    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    let creationDateSwitch = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:CreationDateSwitch');
    const creationDateFilter = FastFiltersHelper.getAppliedDateFilterValueFromContext(context, 'CreationDate');

    if (creationDateFilter.length) {
        let startDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:StartDateFilter');
        let endDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:EndDateFilter');

        creationDateSwitch.setValue(Boolean(creationDateFilter.length));
        startDateControl.setValue(new Date(creationDateFilter[0]));
        endDateControl.setValue(new Date(creationDateFilter[1]));

        startDateControl.setVisible(creationDateFilter.length);
        endDateControl.setVisible(creationDateFilter.length);
    }
}
