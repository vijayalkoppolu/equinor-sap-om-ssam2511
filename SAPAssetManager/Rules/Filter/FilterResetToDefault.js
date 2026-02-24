import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
import FilterLibrary from './FilterLibrary';
import FilterSettings from './FilterSettings';


export default async function FilterResetToDefault(context) {
    FilterLibrary.filterResetToDefaults(context);
    if (await PersonalizationPreferences.getPersistFilterPreference(context)) {
        const filterPageProxy = context.getPageProxy();
        const listPageProxy = filterPageProxy.getFilter().controlProxy.getPageProxy();
        return Promise.resolve(FilterSettings.resetFilters(context, filterPageProxy, listPageProxy));
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
