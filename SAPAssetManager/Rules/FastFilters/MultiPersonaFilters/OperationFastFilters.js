import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { FAST_FILTERS, TIME_FILTERS } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import Logger from '../../Log/Logger';
import isFSMCSKPINewVisible from '../../ServiceOrders/IsFSMCSKPIVisible';
import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';
import isSupervisorFeatureEnabled from '../../Supervisor/isSupervisorFeatureEnabled';
import { getMyOperationsFilterQuery } from '../../WorkOrders/WorkOrderMyOperationsFilter';
import { WORKORDER_ASSN } from '../../Common/Library/AssignmentType';

const ASSIGNMENT_TYPE_1 = WORKORDER_ASSN.HEADER_PERSON_NO;
const ASSIGNMENT_TYPE_2 = WORKORDER_ASSN.OPERATION_PERSON_NO;
const ASSIGNMENT_TYPE_4 = WORKORDER_ASSN.SPLIT_CAPACITY_PERSON_NO;
const ASSIGNMENT_TYPE_5 = WORKORDER_ASSN.HEADER_PLANNER_GROUP;
const ASSIGNMENT_TYPE_6 = WORKORDER_ASSN.OPERATION_WORKCENTER;
const ASSIGNMENT_TYPE_7 = WORKORDER_ASSN.HEADER_BUS_PARTNER;
const ASSIGNMENT_TYPE_8 = WORKORDER_ASSN.HEADER_WORKCENTER;
const ASSIGNMENT_TYPE_A = WORKORDER_ASSN.MRS;

export default class OperationFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            statusPropertyPath: 'OperationMobileStatus_Nav/MobileStatus',
            splitAssignmentPropertyPath: `PersonnelNo eq '${CommonLibrary.getPersonnelNumber()}'`,
            splitStatusPropertyPath: 'PMMobileStatus_Nav/MobileStatus',
            assignmentPropertyPath: 'PersonNum',
            emergencyPropertyPath: 'WOHeader/OrderProcessingContext',
            dueDatePropertyPath: 'WOHeader/DueDate',
            modifiedFilterQuery: '',
            confirmedFilterQuery: '',
        };
        const filterPageName = 'WorkOrderOperationsFilterPage';
        const listPageName = context.getPageProxy().getName();

        super(context, filterPageName, listPageName, config);
    }

    getFastFilters(context) {
        let defaultFilters = [
            { name: FAST_FILTERS.MY_OPERATIONS, value: this._getMyOperationsFilterItemReturnValue(context), visible: this.isMyOperationsFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_CONFIRMED, value: this._getConfirmedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isConfirmedStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_UNCONFIRMED, value: this._getUnconfirmedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isConfirmedStatusFilterVisible(context) },
            (IsFSMCSSectionVisible(context) && PersonaLibrary.isClassicHomeScreenEnabled(context) ?
                { name: STATUS_FAST_FILTERS.STATUS_CS_IN_PROGRESS, value: this._getInProgressCSFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) } :
                { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) }),
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_REVIEW, value: this._getReviewFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isReviewFilterVisible(context) },
            { name: TIME_FILTERS.DUE_DATE_TODAY, value: this._getDueDateFilterItemReturnValue(context, TIME_FILTERS.DUE_DATE_TODAY), visible: this.isDueDateFilterVisible(context) },
            { name: FAST_FILTERS.UNASSIGNED, value: this._getUnassignedFilterItemReturnValue(), property: this.config.assignmentPropertyPath, visible: this.isAssignmentFilterVisible(context) },
            { name: FAST_FILTERS.EMERGENCY, value: this._getEmergencyFilterItemReturnValue(), property: this.config.emergencyPropertyPath, visible: this.isEmergencyFilterVisible(context) },
            { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
        ];
        if (isFSMCSKPINewVisible(context)) {
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
            if (previousPageClientData.OPERATIONS_FAST_FILTER_SHORT_LIST) {
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

    isStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_6 ||
                woAssignmentType === ASSIGNMENT_TYPE_A || woAssignmentType === ASSIGNMENT_TYPE_4;
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

    isConfirmedStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_8 ||
                woAssignmentType === ASSIGNMENT_TYPE_5 || woAssignmentType === ASSIGNMENT_TYPE_7;
        }

        return isFilterVisible;
    }

    isAssignmentFilterVisible(context) {
        let isFilterVisible = CommonLibrary.isWorkOrderAssignmentTypeIncluded(context, ASSIGNMENT_TYPE_6);
        return isFilterVisible && PersonaLibrary.isMaintenanceTechnician(context);
    }

    isMyOperationsFilterVisible(context) {
        let isFilterVisible = CommonLibrary.isWorkOrderAssignmentTypeIncluded(context, ASSIGNMENT_TYPE_6);
        return isFilterVisible && PersonaLibrary.isMaintenanceTechnician(context);
    }

    isDueDateFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_8 ||
                woAssignmentType === ASSIGNMENT_TYPE_5 || woAssignmentType === ASSIGNMENT_TYPE_7 || woAssignmentType === ASSIGNMENT_TYPE_4;
        }
        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_6
                || woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isEmergencyFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria);

        if (this.isEmergencyFilterVisible(context)) {
            let clientData = this.getClientData(context);
            if (clientData.EmergencyFiltering) {
                filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, this.config.emergencyPropertyPath, context.localizeText('emergency_work'), [this._getEmergencyFilterItemReturnValue()], false));
                clientData.EmergencyFiltering = false;
            }
        }

        return filterResults;
    }

    _getAssignmentFilterItemReturnValue() {
        const DEFAULT_PERSONAL_NUMBER = '00000000';
        return CommonLibrary.getPersonnelNumber() || DEFAULT_PERSONAL_NUMBER;
    }

    _getUnassignedFilterItemReturnValue() {
        return '00000000';
    }

    _getMyOperationsFilterItemReturnValue(context) {
        return getMyOperationsFilterQuery(context);
    }

    _getPendingFilterItemReturnValue() {
        return this.config.modifiedFilterQuery ? this.config.modifiedFilterQuery + ' or sap.hasPendingChanges()' : 'sap.hasPendingChanges()';
    }

    isModifiedFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || isFSMCSKPINewVisible(context);
    }

    //This function is inherited from the parent class and adds the additional logic for split statuses
    _updateMobileAndFilterResults(mobileStatusFilterCriteria, context) {
        if (!mobileStatusFilterCriteria) {
            return;
        }
        const filterRVs = [...mobileStatusFilterCriteria.filterItems];
        [mobileStatusFilterCriteria.filterItems, mobileStatusFilterCriteria.filterItemsDisplayValue].forEach(i => i.length = 0);
        if (filterRVs.length === 0) {
            return;
        }
        if ([this.STARTED, this.HOLD].every(i => filterRVs.includes(i))) {
            [this.STARTED, this.HOLD].forEach(i => {
                filterRVs.splice(filterRVs.indexOf(i), 1);
            });
            mobileStatusFilterCriteria.filterItems.push(this._getStartedFilterItemReturnValue());
            mobileStatusFilterCriteria.filterItemsDisplayValue.push(this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_STARTED));
        }
        if (filterRVs.includes(this.COMPLETED)) {
            filterRVs.splice(filterRVs.indexOf(this.COMPLETED), 1);
            mobileStatusFilterCriteria.filterItems.push(this._getCompletedFilterItemReturnValue());
            mobileStatusFilterCriteria.filterItemsDisplayValue.push(this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_COMPLETED));
        }
        filterRVs.forEach(rv => {
            mobileStatusFilterCriteria.filterItems.push(`${this.config.statusPropertyPath} eq '${rv}' or MyWorkOrderOperationCapacityRequirement_/any(cp: (cp/${this.config.splitAssignmentPropertyPath} and cp/${this.config.splitStatusPropertyPath} eq '${rv}'))`);
            mobileStatusFilterCriteria.filterItemsDisplayValue.push(context.localizeText(rv));
        });
    }

    _getCompletedFilterItemReturnValue() {
        return `${this.config.statusPropertyPath} eq '${this.COMPLETED}' or MyWorkOrderOperationCapacityRequirement_/any(cp: (cp/${this.config.splitAssignmentPropertyPath} and cp/${this.config.splitStatusPropertyPath} eq '${this.COMPLETED}'))`;
    }
}
