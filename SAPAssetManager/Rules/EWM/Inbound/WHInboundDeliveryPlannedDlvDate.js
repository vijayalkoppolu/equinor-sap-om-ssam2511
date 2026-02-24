import ODataDate from '../../Common/Date/ODataDate';

export default function WHInboundDeliveryPlannedDlvDate(context) {
    const countdate = context.binding?.PlannedDeliveryDate;
    return countdate ? EWMDisplayDate(context, countdate) : '-';
}

export function EWMDisplayDate(context, countdate) {
    const date = new ODataDate(countdate).toLocalDateString();
    return context.formatDate(date);
}
