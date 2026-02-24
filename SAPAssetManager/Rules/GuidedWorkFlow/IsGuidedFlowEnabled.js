import libFeature from '../UserFeatures/UserFeaturesLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default async function IsGuidedFlowEnabled(context) {
    if (libFeature.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GuidedFlow.global').getValue())) {
        let binding = context.binding;
        if (libVal.evalIsEmpty(binding) || !libVal.evalIsEmpty(binding) && libVal.evalIsEmpty(binding['@odata.type'])) {
            binding = context.getPageProxy().getActionBinding();
        }

        const objectType = libCom.getMobileStatusEAMObjectType(context, binding);
        const headersCount = await libCom.getEntitySetCount(context, 'GuidedFlowHeaders',
            `$filter=ObjectType eq '${objectType}' and Persona eq '${libPersona.getActivePersona(context)}'`);

        return headersCount > 0;
    }

    return false;
}
