import PersonalizationPreferences from './PersonalizationPreferences';

export default function AIJobCompletionSwitchValue(context) {
    return PersonalizationPreferences.getAIJobCompletionPreference(context);
}
