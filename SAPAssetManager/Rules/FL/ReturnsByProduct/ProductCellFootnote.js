/**
 * Returns a concatenated footnote for the ProductCell fragment.
 * Concatenates FldLogsSupplyProcessText and FldLogsRecommendedActionText with a comma.
 * @param {IClientAPI} context
 */
export default function ProductCellFootnote(context) {
    const binding = context.binding || {};
    const supplyProcess = binding.FldLogsSupplyProcess || '';
    const recommendedAction = binding?.FldLogsRecommendedAction_Nav?.FldLogsRecommendedActionText || binding.FldLogsRecommendedAction || '';
    return supplyProcess && recommendedAction
        ? `${supplyProcess}, ${recommendedAction}`
        : supplyProcess || recommendedAction;
}
