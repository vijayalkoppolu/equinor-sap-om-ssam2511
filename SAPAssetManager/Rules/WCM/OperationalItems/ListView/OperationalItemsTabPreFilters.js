import CommonLibrary from '../../../Common/Library/CommonLibrary';
import FilterSettings from '../../../Filter/FilterSettings';
import { OPERATIONAL_ITEMS_LIST_VIEW_PAGE } from './OperationalItemsListViewNav';

const SEQUENCE_SORTER = 'Sequence';
const HEADER_PRIORITY_SORTER = 'WCMDocumentHeaders/Priority';

const LOCALIZATION_MAPPING = {
    [SEQUENCE_SORTER]: 'item_sequence',
    [HEADER_PRIORITY_SORTER]: 'related_safety_certificate_priority',
};

/** @param {IPageProxy} context */
export default function OperationalItemsTabPreFilters(context) {
    const defaultFilters = CreateOperationalItemsDefaultSortOptions(context);

    const parentPageName = CommonLibrary.getStateVariable(context, 'OperationalItemsListPageName');
    const operationalItemsListPageproxy = context.evaluateTargetPathForAPI(`#Page:${parentPageName}`);
    FilterSettings.saveInitialFilterForPage(operationalItemsListPageproxy, defaultFilters);

    return defaultFilters;
}

export function OperationalItemsDefaultSortOptions(context) {
    const options = [SEQUENCE_SORTER];

    if (CommonLibrary.getStateVariable(context, 'OperationalItemsListPageName') === OPERATIONAL_ITEMS_LIST_VIEW_PAGE) {
        options.unshift(HEADER_PRIORITY_SORTER);
    }

    return options;
}

function CreateOperationalItemsDefaultSortOptions(context) {
    return OperationalItemsDefaultSortOptions(context).map(option => {
        return context.createFilterCriteria(context.filterTypeEnum.Sorter, option, 'SortFilter', [option], false, context.localizeText('sort_filter_prefix'), [context.localizeText(LOCALIZATION_MAPPING[option])]);
    });
}
