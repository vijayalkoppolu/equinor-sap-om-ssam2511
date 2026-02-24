export default function ReadyToPackMetricsSubstatusText(context) {
    let quantity = [];
    const qty = Number(context.binding.QuantityInBaseUnit);
    const qtyUnit = context.binding.OrderQuantityUnit;

    // Only show quantity if qty is not 0
    if (!isNaN(qty) && qty !== 0) {
        quantity.push(qty);
        if (qtyUnit) {
            quantity.push(qtyUnit);
        }
    }

    return quantity.join(' ').trim();
}
