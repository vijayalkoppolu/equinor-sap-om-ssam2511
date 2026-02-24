import { FAST_FILTERS, EMERGENCY_FILTER_GROUP } from '../FastFilters';
import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import FastFiltersHelper from '../FastFiltersHelper';
import MyNotificationFilterQuery from '../../Notifications/MyNotificationFilterQuery';
import { getReportedByFilterQuery } from '../../Notifications/MyNotificationFilterQuery';

const NOTIFICATION_FAST_FILTERS = {
    'MINOR': 'FILTER_MINOR',
    'MINOR_WITH_SCREENING': 'FILTER_MINOR_SCREENING',
    'MY_NOTIFICATIONS': 'FILTER_MY_NOTIFICATIONS',
    'REPORTED_BY_ME': 'FILTER_REPORTED_BY_ME',
};

export default class NotificationFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            'modifiedFilterQuery': '',
            statusPropertyPath: 'NotifMobileStatus_Nav/MobileStatus',
        };
        const filterPageName = 'NotificationFilterPage';
        const listPageName = context.getPageProxy().getName();
        super(context, filterPageName, listPageName, config);

        this.setNewFilterCaption(NOTIFICATION_FAST_FILTERS.MY_NOTIFICATIONS, context.localizeText('my_notifications_filter'));
        this.setNewFilterCaption(NOTIFICATION_FAST_FILTERS.REPORTED_BY_ME, context.localizeText('reported_by'));
        this.setNewFilterCaption(NOTIFICATION_FAST_FILTERS.MINOR, context.localizeText('minor_work_filter'));
        this.setNewFilterCaption(NOTIFICATION_FAST_FILTERS.MINOR_WITH_SCREENING, context.localizeText('minor_work_with_screening_filter'));
    }

    getFastFilters(context) {
        return [
            { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: NOTIFICATION_FAST_FILTERS.MY_NOTIFICATIONS, value: this._getMyNotificationsFilterItemReturnValue(context), visible: this.isMyNotificationsFilterVisible(context) },
            { name: NOTIFICATION_FAST_FILTERS.REPORTED_BY_ME, value: this._getReportedByMeFilterItemReturnValue(context), visible: this.isReportedByMeFilterVisible(context) },
            { name: NOTIFICATION_FAST_FILTERS.MINOR, value: this._getMinorFilterItemReturnValue(), group: EMERGENCY_FILTER_GROUP, visible: this.isMinorFilterVisible(context) },
            { name: NOTIFICATION_FAST_FILTERS.MINOR_WITH_SCREENING, value: this._getMinorWithScreeningFilterItemReturnValue(), group: EMERGENCY_FILTER_GROUP, visible: this.isMinorFilterVisible(context) },
            { name: FAST_FILTERS.EMERGENCY, value: this._getEmergencyFilterItemReturnValue(), group: EMERGENCY_FILTER_GROUP, visible: this.isEmergencyFilterVisible(context) },
            { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
        ];
    }

    resetClientData(context) {
        super.resetClientData(context);
        let clientData = this.getClientData(context);

        //CREATED_BY_ME
        clientData.myNotifications = false;
    }

    // sets values from the fast filter to the modal filter page
    setFastFilterValuesToFilterPage(context) {
        let fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);

        fastFilters.forEach(filter => {
            filter.filterItems.forEach(filterValue => {
                if (filterValue === this._getMyNotificationsFilterItemReturnValue(context)) {
                    if (this.isMyNotificationsFilterVisible(context)) {
                        let clientData = this.getClientData(context);
                        clientData.myNotifications = true;
                    }
                }
            });
        });

        super.setFastFilterValuesToFilterPage(context);
    }

    // sets values from the modal filter page to the fast filter
    getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria);
        let clientData = this.getClientData(context);

        if (this.isMyNotificationsFilterVisible(context) && clientData.myNotifications) {
            filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(NOTIFICATION_FAST_FILTERS.MY_NOTIFICATIONS), [this._getMyNotificationsFilterItemReturnValue(context)]));
            clientData.myNotifications = false;
        }

        return filterResults;
    }

    isMyNotificationsFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isMaintenanceTechnicianStd(context) || PersonaLibrary.isWCMOperator(context) || PersonaLibrary.isFieldServiceTechnician(context);
    }

    isReportedByMeFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isMaintenanceTechnicianStd(context) || PersonaLibrary.isWCMOperator(context) || PersonaLibrary.isFieldServiceTechnician(context);
    }

    isMinorFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isMaintenanceTechnicianStd(context) || PersonaLibrary.isWCMOperator(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    isEmergencyFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isMaintenanceTechnicianStd(context) || PersonaLibrary.isWCMOperator(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    isModifiedFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isMaintenanceTechnicianStd(context) || PersonaLibrary.isWCMOperator(context) || PersonaLibrary.isFieldServiceTechnician(context);
    }

    _getMyNotificationsFilterItemReturnValue(context) {
        return MyNotificationFilterQuery(context);
    }

    _getReportedByMeFilterItemReturnValue(context) {
        return getReportedByFilterQuery(context);
    }

    _getMinorFilterItemReturnValue() {
        return 'sap.entityexists(NotificationProcessingContext_Nav) and NotifProcessingContext eq \'02\'';
    }

    _getMinorWithScreeningFilterItemReturnValue() {
        return 'sap.entityexists(NotificationProcessingContext_Nav) and NotifProcessingContext eq \'MS\'';
    }

    _getEmergencyFilterItemReturnValue() {
        return 'sap.entityexists(NotificationProcessingContext_Nav) and NotifProcessingContext eq \'01\'';
    }

    _getPendingFilterItemReturnValue() {
        return this.config.modifiedFilterQuery ? this.config.modifiedFilterQuery + ' or sap.hasPendingChanges()' : 'sap.hasPendingChanges()';
    }

    isStatusFilterVisible() {
        return true;
    }
}
