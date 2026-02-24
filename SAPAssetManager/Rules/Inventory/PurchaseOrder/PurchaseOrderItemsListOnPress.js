import SetVisibleFilterButton from '../Common/SetVisibleFilterButton';

/**
 * Show the filter button when the user navigates to the Purchase Order Items list
 * @param {IClientAPI} context
 */
export default function PurchaseOrderItemsListOnPress(context) {
    context.evaluateTargetPathForAPI('#Page:PurchaseOrderItemsListPage').getControl('SectionedTable').redraw();
    SetVisibleFilterButton(context);
}
