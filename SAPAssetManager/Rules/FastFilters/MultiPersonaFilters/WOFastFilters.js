import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { FAST_FILTERS, TIME_FILTERS } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import FastFiltersHelper from '../FastFiltersHelper';
import Logger from '../../Log/Logger';
import IsFSMCSKPIVisible from '../../ServiceOrders/IsFSMCSKPIVisible';
import libCom from '../../Common/Library/CommonLibrary';
import isSupervisorFeatureEnabled from '../../Supervisor/isSupervisorFeatureEnabled';
import { WORKORDER_ASSN } from '../../Common/Library/AssignmentType';
import { getMyWorkOrdersFilterQuery, getAssignToFilterQuery } from '../../WorkOrders/WorkOrderMyWorkordersFilter';


const ASSIGNMENT_TYPE_1 = WORKORDER_ASSN.HEADER_PERSON_NO;
const ASSIGNMENT_TYPE_2 = WORKORDER_ASSN.OPERATION_PERSON_NO;
const ASSIGNMENT_TYPE_5 = WORKORDER_ASSN.HEADER_PLANNER_GROUP;
const ASSIGNMENT_TYPE_6 = WORKORDER_ASSN.OPERATION_WORKCENTER;
const ASSIGNMENT_TYPE_7 = WORKORDER_ASSN.HEADER_BUS_PARTNER;
const ASSIGNMENT_TYPE_8 = WORKORDER_ASSN.HEADER_WORKCENTER;

export default class WOFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            statusPropertyPath: 'OrderMobileStatus_Nav/MobileStatus',
            emergencyPropertyPath: 'OrderProcessingContext',
            dueDatePropertyPath: 'DueDate',
            modifiedFilterQuery: '',
        };
        const filterPageName = 'WorkOrderFilterPage';
        const listPageName = context.getPageProxy().getName();
        super(context, filterPageName, listPageName, config);
    }

    getFastFilters(context) {
        let flightFilter = libCom.getStateVariable(context, 'flightOrderTypesFilter');
        let defaultFilters = [
            { name: FAST_FILTERS.MY_WORK_ORDERS, value: this._getMyWorkOrdersFilterItemReturnValue(context), visible: this.isMyWorkOrdersFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_MT_OPEN, value: this._getOpenMTFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_REVIEW, value: this._getReviewFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isReviewFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), visible: this.isDueDateFilterVisible(context) },
            { name: FAST_FILTERS.UNASSIGNED, value: this._getUnassignedtFilterItemReturnValue(), visible: this.isAssignmentFilterVisible(context) },
            { name: FAST_FILTERS.EMERGENCY, value: this._getEmergencyFilterItemReturnValue(), property: this.config.emergencyPropertyPath, visible: this.isEmergencyFilterVisible(context) },
            { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
        ];

        if (flightFilter) { //Defense feature flight orders
            defaultFilters.push({ name: FAST_FILTERS.FLIGHT_ORDERS, value: flightFilter, visible: true });
        }
        if (IsFSMCSKPIVisible(context)) {
            return [
                { name: STATUS_FAST_FILTERS.STATUS_CS_OPEN, value: this._getOpenCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                { name: STATUS_FAST_FILTERS.STATUS_CS_IN_PROGRESS, value: this._getInProgressCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                { name: STATUS_FAST_FILTERS.STATUS_CS_COMPLETED, value: this._getCompletedCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), visible: this.isDueDateFilterVisible(context) },
                { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
            ];
        }
        try {
            let previousPageClientData = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData() || {};
            if (previousPageClientData.WORKORDER_FAST_FILTER_SHORT_LIST) {
                return [
                    { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                    { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
                ];
            }
            return defaultFilters;
        } catch (error) {
            Logger.error('getFastFilters', error);
            return defaultFilters;
        }
    }

    resetClientData(context) {
        let clientData = this.getClientData(context);

        //EMERGENCY
        clientData.OrderProcessingContext = false;
    }

    // sets values from the fast filter to the modal filter page
    setFastFilterValuesToFilterPage(context) {
        let fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);
        let clientData = this.getClientData(context);

        fastFilters.forEach(filter => {
            filter.filterItems.forEach(filterValue => {
                if (filterValue === this._getEmergencyFilterItemReturnValue() && this.isEmergencyFilterVisible(context)) {
                    clientData.OrderProcessingContext = true;
                }
            });
        });

        super.setFastFilterValuesToFilterPage(context);
    }

    // sets values from the modal filter page to the fast filter
    getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria, dueDateResult) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria, dueDateResult);
        let clientData = this.getClientData(context);

        if (this.isEmergencyFilterVisible(context) && clientData.OrderProcessingContext) {
            clientData.OrderProcessingContext = false;
        }

        return filterResults;
    }

    isStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_8 ||
                woAssignmentType === ASSIGNMENT_TYPE_5 || woAssignmentType === ASSIGNMENT_TYPE_7;
        }
        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_6
                || woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isReviewFilterVisible(context) {
        return isSupervisorFeatureEnabled(context) && PersonaLibrary.isMaintenanceTechnician(context);
    }

    isDueDateFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_5 ||
                woAssignmentType === ASSIGNMENT_TYPE_7 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }
        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_2
                || woAssignmentType === ASSIGNMENT_TYPE_6 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isAssignmentFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_8;
        return isFilterVisible && (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context));
    }

    isEmergencyFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    isMyWorkOrdersFilterVisible(context) { 
        let isFilterVisible = CommonLibrary.isWorkOrderAssignmentTypeIncluded(context, ASSIGNMENT_TYPE_8);
        return isFilterVisible && PersonaLibrary.isMaintenanceTechnician(context);
    }

    _getAssignmentFilterItemReturnValue() {
        return getAssignToFilterQuery();
    }

    _getUnassignedtFilterItemReturnValue() {
        const DEFAULT_PERSONAL_NUMBER = '00000000';
        return 'unassigned' || DEFAULT_PERSONAL_NUMBER;
    }

    _getPendingFilterItemReturnValue() {
        return this.config.modifiedFilterQuery ? this.config.modifiedFilterQuery + ' or sap.hasPendingChanges()' : 'sap.hasPendingChanges()';
    }

    isModifiedFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context) || IsFSMCSKPIVisible(context);
    }

    _getMyWorkOrdersFilterItemReturnValue(context) {
        return getMyWorkOrdersFilterQuery(context);
    }
}
