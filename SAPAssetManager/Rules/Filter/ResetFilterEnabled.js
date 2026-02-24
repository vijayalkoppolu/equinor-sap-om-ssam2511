import CommonLibrary from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';
import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
import FilterLibrary from './FilterLibrary';
import FilterSettings from './FilterSettings';

export default async function ResetFilterEnabled(context) {
    try {
        const pageProxy = context.getPageProxy();
        const isFilterPersistEnabled = await PersonalizationPreferences.getPersistFilterPreference(context);

        let hasSaved = false;
        if (isFilterPersistEnabled) {
            hasSaved = await hasSavedFilter(context, FilterSettings.getPreferenceName(pageProxy));
        }

        const controlCount = FilterLibrary.getFilterCount(pageProxy, false);
        const filters = pageProxy.getFilter()?.getFilters() || [];
        const hasActiveFilterCriteria = filters.some(f =>
            Array.isArray(f.filterItems) &&
            f.filterItems.length > 0,
        );

        return hasSaved || controlCount > 0 || hasActiveFilterCriteria;
    } catch (err) {
        Logger.error('Reset filter button', `ResetFilterEnabled error: ${err}`);
        return false;
    }
}

function hasSavedFilter(context, preferenceName) {
    return FilterSettings.readFilterSettingsByPreferenceName(context, preferenceName)
        .then(savedFilter => savedFilter && FilterSettings.parseFilterCriteriaString(context, savedFilter.PreferenceValue))
        .then(parsedFilterCriteria => parsedFilterCriteria?.filter(c => CommonLibrary.isDefined(c.filterItems)))
        .then(parsedFilterCriteria => !ValidationLibrary.evalIsEmpty(parsedFilterCriteria))
        .catch(() => false);
}
