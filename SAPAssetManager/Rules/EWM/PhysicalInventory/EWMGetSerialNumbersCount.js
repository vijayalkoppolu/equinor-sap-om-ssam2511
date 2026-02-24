export default function EWMGetSerialNumbersCount(context) {
    const sernumqty = context.binding?.length || 0;
    return context.localizeText('items_x', [sernumqty]);
}
