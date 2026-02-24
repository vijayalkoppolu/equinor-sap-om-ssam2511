import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { FAST_FILTERS } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import Logger from '../../Log/Logger';
import { getMySubOperationsFilterQuery } from '../../WorkOrders/WorkOrderMySubOperationsFilter';
import { WORKORDER_ASSN } from '../../Common/Library/AssignmentType';

const ASSIGNMENT_TYPE_3 = WORKORDER_ASSN.SUB_OPERATION_PERSON_NO;
const ASSIGNMENT_TYPE_1 = WORKORDER_ASSN.HEADER_PERSON_NO;
const ASSIGNMENT_TYPE_8 = WORKORDER_ASSN.HEADER_WORKCENTER;
const ASSIGNMENT_TYPE_2 = WORKORDER_ASSN.OPERATION_PERSON_NO;
const ASSIGNMENT_TYPE_4 = WORKORDER_ASSN.SPLIT_CAPACITY_PERSON_NO;

export default class SubOperationFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            statusPropertyPath: 'SubOpMobileStatus_Nav/MobileStatus',
            emergencyPropertyPath: 'WorkOrderOperation/WOHeader/OrderProcessingContext',
            confirmedFilterQuery: '',
        };
        const filterPageName = 'SubOperationsFilterPage';
        const listPageName = context.getPageProxy().getName();

        super(context, filterPageName, listPageName, config);
    }

    getFastFilters(context) {
        let defaultFilters = [];

        defaultFilters = [
            { name: FAST_FILTERS.MY_SUBOPERATIONS, value: this._getMySubOperationsFilterItemReturnValue(context), visible: this.isMySubOperationsFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_CONFIRMED, value: this._getConfirmedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isConfirmedStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_UNCONFIRMED, value: this._getUnconfirmedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isConfirmedStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_STARTED, value: this._getStartedFilterItemReturnValue(), group: STATUS_FILTER_GROUP , visible: this.isStatusFilterVisible(context)},
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: FAST_FILTERS.EMERGENCY, value: this._getEmergencyFilterItemReturnValue(), property: this.config.emergencyPropertyPath, visible: this.isEmergencyFilterVisible(context) },
            { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
        ];
        if (!PersonaLibrary.isClassicHomeScreenEnabled(context)) { //Add 'Open' filter if new overview is visible
            defaultFilters.push({ name: STATUS_FAST_FILTERS.STATUS_MT_OPEN, value: this._getOpenMTFilterItemReturnValue(), group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) });
        }
        return defaultFilters;
    }

    isStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_3;
        return isFilterVisible && PersonaLibrary.isMaintenanceTechnician(context);
    }

    getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria);

        if (this.isEmergencyFilterVisible(context)) {
            let clientData = this.getClientData(context);
            if (clientData.EmergencyFiltering) {
                filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, this.config.emergencyPropertyPath, this.getFilterCaption(FAST_FILTERS.EMERGENCY), [this._getEmergencyFilterItemReturnValue()], false));
                clientData.EmergencyFiltering = false;
            }
        }

        return filterResults;
    }

    isConfirmedStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isMaintenanceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_8 ||
                woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_4;
        }

        return isFilterVisible;
    }

    isMySubOperationsFilterVisible(context) { 
        let isFilterVisible = CommonLibrary.isWorkOrderAssignmentTypeIncluded(context, ASSIGNMENT_TYPE_3);
        return isFilterVisible && PersonaLibrary.isMaintenanceTechnician(context);
    }

    updateFilterFeedbackBar(sectionedTable, newFilters) {
        if (sectionedTable && sectionedTable._control) {
            try {
                return sectionedTable._control.setFilters(newFilters, true, true);
            } catch (error) {
                Logger.error('updateFilterFeedbackBar', error);
                return Promise.resolve();
            }
        }

        return Promise.resolve();
    }

    _getMySubOperationsFilterItemReturnValue(context) {
        return getMySubOperationsFilterQuery(context);
    }
}

