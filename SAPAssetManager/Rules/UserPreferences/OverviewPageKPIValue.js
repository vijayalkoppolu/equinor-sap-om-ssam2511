import PersonalizationPreferences from './PersonalizationPreferences';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OverviewPageKPIValue(context) {
    return PersonalizationPreferences.getOverviewPageKPIPreference(context);
}
