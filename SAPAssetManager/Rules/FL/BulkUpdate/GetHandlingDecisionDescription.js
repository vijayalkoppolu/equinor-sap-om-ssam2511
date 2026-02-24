export default function GetHandlingDecisionDescription(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHandlingDecisions', [], `$filter=HandlingDecision eq '${context.binding.HandlingDecision}'`).then(function(result) {
        return result?.length > 0 ? result.getItem(0).Description : context.binding.HandlingDecision;      
    });
}

