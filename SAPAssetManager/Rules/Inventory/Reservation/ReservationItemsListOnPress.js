import SetVisibleFilterButton from '../Common/SetVisibleFilterButton';
/**
 * Item List Tab on press handler
 * @param {IClientAPI} context 
 */
export default function ReservationItemsListOnPress(context) {
    context.evaluateTargetPathForAPI('#Page:ReservationItemsListPage').getControl('SectionedTable').redraw();
    SetVisibleFilterButton(context);
}
