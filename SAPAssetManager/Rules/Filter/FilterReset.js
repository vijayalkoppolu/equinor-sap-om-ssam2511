import Logger from '../Log/Logger';
import filterLib from '../Filter/FilterLibrary';
import FilterSettings from './FilterSettings';
import commonLib from '../Common/Library/CommonLibrary';
import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';

export default async function FilterReset(context) {
    try {
        let skipClosePage = false;
        if (!commonLib.getPageName(context).includes('Online') && (await PersonalizationPreferences.getPersistFilterPreference(context))) {
            skipClosePage = true;
            FilterSettings.resetFilters(context, context.getPageProxy(), context.evaluateTargetPathForAPI('#Page:-Previous'));
        }
        return Promise.resolve(filterLib.filterResetToDefaults(context))
            .then(() => {
                if (skipClosePage) {
                    return Promise.resolve();
                }
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterReset error: ${exception}`);
    }
}
