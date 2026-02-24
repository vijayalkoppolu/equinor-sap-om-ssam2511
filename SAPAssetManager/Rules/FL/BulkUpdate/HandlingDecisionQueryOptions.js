export default function HandlingDecisionQueryOptions(context) {
    if (context.binding && context.binding.ProcessType) {
        return `$orderby=HandlingDecision,ProcessType&$filter=ProcessType eq '${context.binding.ProcessType}'`;
    } else {
        return '$orderby=HandlingDecision,ProcessType';
    }
}
