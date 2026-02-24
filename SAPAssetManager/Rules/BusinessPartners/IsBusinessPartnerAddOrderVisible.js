import IsS4ServiceOrderCreateEnabled from '../ServiceOrders/CreateUpdate/IsS4ServiceOrderCreateEnabled';
import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsBusinessPartnerAddOrderVisible(context) {
    if (!IsS4ServiceOrderCreateEnabled(context)) return false;
    return IsBusinessPartnerAddOrderOrRequestVisible(context);
}

export function IsBusinessPartnerAddOrderOrRequestVisible(context) {
    const type = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/SoldToPartyType.global').getValue();
    const binding = context.getBindingObject();
    let parentFunctionType = '';
    
    if (binding?.S4PartnerFunc_Nav) {
        parentFunctionType = binding.S4PartnerFunc_Nav?.PartnerFunction;
    }

    return parentFunctionType && parentFunctionType === type && 
        UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceData.global').getValue());
}
