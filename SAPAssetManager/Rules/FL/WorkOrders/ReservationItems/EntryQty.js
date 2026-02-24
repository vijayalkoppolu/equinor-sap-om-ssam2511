export default function EntryQty(context) {
    return Number(context.evaluateTargetPath('#Control:WithdrawnQuantity/#Value'));
}
