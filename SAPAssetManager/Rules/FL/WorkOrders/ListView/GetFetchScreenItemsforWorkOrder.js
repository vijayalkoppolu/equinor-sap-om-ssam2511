export default function GetFetchScreenItemsforWorkOrder(context) {
    let totalItems = context.binding.ItemCount ? String(context.binding.ItemCount).replace(/^0+/, '') : '0';
    const totalitemscaption = context.localizeText(totalItems === '1' ? 'x_item' : 'x_items', [totalItems]);
    return totalitemscaption;
}
