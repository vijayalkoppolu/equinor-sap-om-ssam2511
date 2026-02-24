import FastFiltersHelper from './FastFiltersHelper';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import FastFilters from './FastFilters';

export const STATUS_FILTER_GROUP = 'status';

export const STATUS_FAST_FILTERS = {
    'STATUS_STARTED': 'FILTER_STATUS_STARTED',
    'STATUS_COMPLETED': 'FILTER_STATUS_COMPLETED',
    'STATUS_CS_COMPLETED': 'FILTER_STATUS_CS_COMPLETED',
    'STATUS_IN_PROCESS': 'FILTER_STATUS_IN_PROCESS',
    'STATUS_CS_IN_PROGRESS': 'FILTER_STATUS_CS_IN_PROGRESS',
    'STATUS_OPEN': 'FILTER_STATUS_OPEN',
    'STATUS_MT_OPEN': 'FILTER_STATUS_MT_OPEN',
    'STATUS_CS_OPEN': 'FILTER_STATUS_CS_OPEN',
    'STATUS_CONFIRMED': 'FILTER_STATUS_CONFIRMED',
    'STATUS_UNCONFIRMED': 'FILTER_STATUS_UNCONFIRMED',
    'STATUS_RECEIVED': 'FILTER_STATUS_RECEIVED',
    'STATUS_REVIEW': 'FILTER_STATUS_REVIEW',
};

// extends FastFilters by statuses filtering
export default class FastFiltersWithStatuses extends FastFilters {

    constructor(context, filterPageName, listPageName, config = {}) {
        super(context, filterPageName, listPageName, config);

        this.HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        this.STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        this.COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        this.RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
        this.ACCEPTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
        this.TRAVEL = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
        this.ONSITE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
        this.REVIEW = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());


        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_STARTED, context.localizeText('kpi_in_progress'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_COMPLETED, context.localizeText('completed'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_REVIEW, context.localizeText('pending_review'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_CS_COMPLETED, context.localizeText('completed'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_IN_PROCESS, context.localizeText('in_process'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_CS_IN_PROGRESS, context.localizeText('in_progress'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_OPEN, context.localizeText('open'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_MT_OPEN, context.localizeText('open'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_CS_OPEN, context.localizeText('open'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_CONFIRMED, context.localizeText('confirmed_filter'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_UNCONFIRMED, context.localizeText('unconfirmed_filter'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_RECEIVED, context.localizeText('received'));

        this.dateFilter = CommonLibrary.getStateVariable(context, 'DATE_FILTER') || CommonLibrary.getStateVariable(context, 'OPERATIONS_DATE_FILTER');
    }

    resetClientData(context) {
        super.resetClientData(context);
        let clientData = this.getClientData(context);

        //STATUS_IN_PROCESS
        clientData.inProcessStatusFilter = false;
        clientData.inProgressCSStatusFilter = false;

        //STATUS_OPEN
        clientData.openStatusFilter = false;
        clientData.openCSStatusFilter = false;
    }

    // extends FastFilters method
    // sets up values from status fast filters
    setFastFilterValuesToFilterPage(context) {
        let fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);
        let selectedStatuses = [];
        let clientData = this.getClientData(context);

        fastFilters.forEach(filter => {
            filter.filterItems.forEach(filterValue => {
                switch (filterValue) {
                    case this._getStartedFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            selectedStatuses.push(this.STARTED, this.HOLD);
                        }
                        break;
                    }
                    case this._getCompletedFilterItemReturnValue():
                    case this._getCompletedCSFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            selectedStatuses.push(this.COMPLETED);
                        }
                        break;
                    }
                    case this._getOpenFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            clientData.openStatusFilter = true;
                        }
                        break;
                    }
                    case this._getOpenMTFilterItemReturnValue(): {
                        this._setOpenMTStatusFilter(context, clientData);
                        break;
                    }
                    case this._getOpenCSFilterItemReturnValue(): {
                        this._setOpenCSStatusFilter(context, clientData);
                        break;
                    }
                    case this._getInProcessFilterItemReturnValue(): {
                        this._setInProcessStatusFilter(context, clientData);
                        break;
                    }
                    case this._getInProgressCSFilterItemReturnValue(): {
                        this._setInProgressCSStatusFilter(context, clientData);
                        break;
                    }
                    default: {
                        if (this.isStatusFilterVisible(context) && filterValue.includes(`${this.config.statusPropertyPath} eq `)) {
                            selectedStatuses.push(filterValue.split('\'')[1]);
                        }
                        break;
                    }
                }
            });
        });

        this._setStatusesFastFilterValuesToFilterPage(context, selectedStatuses);

        super.setFastFilterValuesToFilterPage(context);
    }

    _setInProgressCSStatusFilter(context, clientData) {
        if (this.isStatusFilterVisible(context)) {
            clientData.inProgressCSStatusFilter = true;
        }
    }

    _setInProcessStatusFilter(context, clientData) {
        if (this.isStatusFilterVisible(context)) {
            clientData.inProcessStatusFilter = true;
        }
    }

    _setOpenCSStatusFilter(context, clientData) {
        if (this.isStatusFilterVisible(context)) {
            clientData.openCSStatusFilter = true;
        }
    }

    _setOpenMTStatusFilter(context, clientData) {
        if (this.isStatusFilterVisible(context)) {
            clientData.openMTStatusFilter = true;
        }
    }

    // extends FastFilters method
    // handles values for status fast filters from the filter page
    getFastFilterValuesFromFilterPage(context, mobileStatusFilterCriteria, dueDateResult) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context, null, dueDateResult);
        let clientData = this.getClientData(context);

        if (this.isStatusFilterVisible(context)) {
            mobileStatusFilterCriteria._isArrayFilterProperty = true;
            this._updateMobileAndFilterResults(mobileStatusFilterCriteria, context);

            if (clientData.inProcessStatusFilter) {
                mobileStatusFilterCriteria.filterItems.push(this._getInProcessFilterItemReturnValue());
                mobileStatusFilterCriteria.filterItemsDisplayValue.push(this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_IN_PROCESS));
                clientData.inProcessStatusFilter = false;
            }

            if (clientData.inProgressCSStatusFilter) {
                mobileStatusFilterCriteria.filterItems.push(this._getInProgressCSFilterItemReturnValue());
                mobileStatusFilterCriteria.filterItemsDisplayValue.push(this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_CS_IN_PROGRESS));
                clientData.inProgressCSStatusFilter = false;
            }

            if (clientData.openStatusFilter) {
                mobileStatusFilterCriteria.filterItems.push(this._getOpenFilterItemReturnValue());
                mobileStatusFilterCriteria.filterItemsDisplayValue.push(this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_OPEN));
                clientData.openStatusFilter = false;
            }

            if (clientData.openCSStatusFilter) {
                mobileStatusFilterCriteria.filterItems.push(this._getOpenCSFilterItemReturnValue());
                mobileStatusFilterCriteria.filterItemsDisplayValue.push(this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_CS_OPEN));
                clientData.openCSStatusFilter = false;
            }
        }

        return filterResults;
    }

    // combines custom quick filter status queries with the standard mobile filter status result
    // deletes result of the standard mobile filter if custom filter needs to use
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
            mobileStatusFilterCriteria.filterItems.push(`${this.config.statusPropertyPath} eq '${rv}'`);
            mobileStatusFilterCriteria.filterItemsDisplayValue.push(context.localizeText(rv));
        });
    }

    _setStatusesFastFilterValuesToFilterPage(context, fastFilterSelectedStatuses) {
        if (!fastFilterSelectedStatuses.length) {
            return;
        }
        let mobileStatusControl = context.evaluateTargetPath(`#Page:${this.filterPageName}/#Control:MobileStatusFilter`);
        if (mobileStatusControl.type === 'Control.Type.FormCell.ListPicker') {
            this._setStatusesFastFilterValuesToFilterPageListPicker(mobileStatusControl, fastFilterSelectedStatuses);
        } else {
            this._setStatusesFastFilterValuesToFilterPageFormCell(mobileStatusControl, fastFilterSelectedStatuses);
        }
    }

    _setStatusesFastFilterValuesToFilterPageListPicker(mobileStatusControl, fastFilterSelectedStatuses) {
        const statuses = mobileStatusControl.getValue().map(f => f.ReturnValue) || [];
        mobileStatusControl.setValue(statuses.concat(fastFilterSelectedStatuses.filter(status => !statuses.includes(status))));
    }

    _setStatusesFastFilterValuesToFilterPageFormCell(mobileStatusControl, fastFilterSelectedStatuses) {
        const statuses = mobileStatusControl.getValue().filterItems || [];
        mobileStatusControl.observable().updateSelectedValues(statuses.concat(fastFilterSelectedStatuses.filter(status => !statuses.includes(status))));
    }

    isStatusFilterVisible() {
        Logger.info('FastFilters', 'isStatusFilterVisible is not implemented');
        return false;
    }

    isConfirmedStatusFilterVisible() {
        Logger.info('FastFilters', 'isConfirmedStatusFilterVisible is not implemented');
        return false;
    }

    _getStartedFilterItemReturnValue() {
        return `(${this.config.statusPropertyPath} eq '${this.STARTED}' or ${this.config.statusPropertyPath} eq '${this.HOLD}')`;
    }

    _getOpenMTFilterItemReturnValue() {
        return `(${this.config.statusPropertyPath} ne '${this.STARTED}' and ${this.config.statusPropertyPath} ne '${this.HOLD}' and ${this.config.statusPropertyPath} ne '${this.COMPLETED}')`;
    }

    _getOpenCSFilterItemReturnValue() {
        let query = `(${this.config.statusPropertyPath} eq '${this.RECEIVED}' or ${this.config.statusPropertyPath} eq '${this.ACCEPTED}')`;
        if (this.dateFilter) {
            query += ` and ${this.dateFilter}`;
        }
        return query;
    }

    _getCompletedFilterItemReturnValue() {
        return `${this.config.statusPropertyPath} eq '${this.COMPLETED}'`;
    }

    _getReviewFilterItemReturnValue() {
        return `${this.config.statusPropertyPath} eq '${this.REVIEW}'`;
    }

    _getCompletedCSFilterItemReturnValue() {
        let query = `(${this.config.statusPropertyPath} eq '${this.COMPLETED}')`;
        if (this.dateFilter) {
            query += `and ${this.dateFilter})`;
        }
        return query;
    }

    _getInProgressCSFilterItemReturnValue() {
        let query = `(${this.config.statusPropertyPath} eq '${this.STARTED}' or ${this.config.statusPropertyPath} eq '${this.HOLD}' or ${this.config.statusPropertyPath} eq '${this.TRAVEL}' or ${this.config.statusPropertyPath} eq '${this.ONSITE}')`;
        if (this.dateFilter) {
            query += `and ${this.dateFilter}`;
        }
        return query;
    }

    _getInProcessFilterItemReturnValue() {
        Logger.info('FastFilters', '_getInProcessFilterItemReturnValue is not implemented');
        return 'false';
    }

    _getOpenFilterItemReturnValue() {
        Logger.info('FastFilters', '_getOpenFilterItemReturnValue is not implemented');
        return 'false';
    }

    _getConfirmedFilterItemReturnValue() {
        let query = this.config.confirmedFilterQuery;
        return query ? query : 'false';
    }

    _getUnconfirmedFilterItemReturnValue() {
        let query = this.config.confirmedFilterQuery;
        return query ? 'not (' + query + ')' : 'true';
    }
}
