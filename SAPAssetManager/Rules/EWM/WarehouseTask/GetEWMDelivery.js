export default function GetEWMDelivery(context) {
    if (context.binding.EWMOutDel) {
        return `${context.binding.EWMOutDel}/${context.binding.EWMOutDelItem}`;
    }
    if (context.binding.EWMInbDel) {
        return `${context.binding.EWMInbDel}/${context.binding.EWMInbDelItem}`;
    }
    return '-';
}
