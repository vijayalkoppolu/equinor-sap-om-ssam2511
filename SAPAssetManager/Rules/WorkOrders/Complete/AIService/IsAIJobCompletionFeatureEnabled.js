import isNetworkConnected from '../../../Common/IsNetworkConnected';
import IsS4ServiceIntegrationNotEnabled from '../../../ServiceOrders/IsS4ServiceIntegrationNotEnabled';
import UserFeaturesLibrary from '../../../UserFeatures/UserFeaturesLibrary';
import PersonalizationPreferences from '../../../UserPreferences/PersonalizationPreferences';

export default function IsAIJobCompletionFeatureEnabled(context) {
    const isAIJobCompletionFeatureEnabled = UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AIJobComplete.global').getValue());
    const networkConnected = isNetworkConnected(context);
    const IsS4ServiceIntegrationDisabled = IsS4ServiceIntegrationNotEnabled(context);
    return isAIJobCompletionFeatureEnabled && networkConnected && IsS4ServiceIntegrationDisabled && PersonalizationPreferences.getAIJobCompletionPreference(context);
}
