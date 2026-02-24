export default function GetWorkNetworkOrderItemCount(context) {
    const items = context.binding.FldLogsWoProduct_Nav || [];
    const currentCount = items.map(row => row.Status === 'R' ? 1 : 0).reduce((sum, n) => sum + n, 0); 
    const totalCount = Array.isArray(items) ? items.length : 0;
    const itemsText = context.localizeText('x_items', [totalCount]);
    const ofText = context.localizeText('of');
    return `${currentCount} ${ofText} ${itemsText}`;
}
