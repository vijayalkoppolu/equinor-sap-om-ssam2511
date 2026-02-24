import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
import FilterDone from './FilterDone';
import SaveFilterAsDefault from './SaveFilterAsDefault';

export default async function ApplyFilterAndSave(context) {
    if (await PersonalizationPreferences.getPersistFilterPreference(context)) {
        await SaveFilterAsDefault(context);
    }
    return FilterDone(context);
}
