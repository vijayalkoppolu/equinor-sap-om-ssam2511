import libPersona from '../../Persona/PersonaLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function SDFCreateEnabled(context, binding = context.getPageProxy().binding) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/SAPDynamicForms.global').getValue())) {
        return !libPersona.isWCMOperator(context) || checkObjectForSafetyTechnician(context, binding);
    }

    return false;
}

function checkObjectForSafetyTechnician(context, binding) {
    // Form creation should only be allowed for a work permit or certificate in any system status other than closed
    return [
        context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue(),
    ].includes(binding?.['@odata.type']) &&
        binding?.ActualSystemStatus !== context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Closed.global').getValue();
}
