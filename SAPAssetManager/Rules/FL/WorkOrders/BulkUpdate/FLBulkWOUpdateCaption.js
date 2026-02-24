export default function FLBulkWOUpdateCaption(context) {
    // This function returns the caption for the Bulk Update action in the FL Work Orders
    const page = context.evaluateTargetPath('#Page:' + 'FLWorkOrderDetailView');
    const tab = page.controls.find(i => i.name === 'TabsControl');
    if (tab?.getSelectedTabItemName() === 'ReservationItems') {
        return context.localizeText('fld_return_reservation_items');
    } else {
        return context.localizeText('fld_return_product');
    }
}
