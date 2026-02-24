export default function ProductCellDescription(context) {
    const location = context.binding?.SupplyingStorageLocation;
    const plant = context.binding?.FieldLogisticsTransferPlant;
    let desc = location && plant ? `${location}, ${plant}` : location || plant || '';

    const status = context.binding.FldLogsReturnStatus;
    if (status === '30' || status === '40') {
        const date = context.binding.RequestedShippingDate;
        if (date) {
            const dateLabel = context.localizeText('requested_delivery_date');
            desc += `\n${dateLabel}: ${formatDate(date)}`;
        }
    } else if (status === '50') {
        const date = context.binding.DispatchedStartDate;
        if (date) {
            const periodLabel = context.localizeText('fld_dispatch_period');
            desc += `\n${periodLabel}: ${formatDate(date)}`;
        }
    }
    return desc;
}

    export function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
