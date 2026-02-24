import WHInboundDeliveryItemListOnSelectionChanged from './WHInboundDeliveryItemListOnSelectionChanged';

export default function WHInboundDeliveryItemListHeaderButtonOnPress(context) {
    const section = context.getPageProxy().getControls()[0].getSections()[0];

    if (context.getName() === 'SelectItems') {
        section.setSelectionMode('Multiple');
    } else if (context.getName() === 'DeselectAll') {
        section.deselectAllItems();
    } else {
        section.selectAllItems();
    }

    WHInboundDeliveryItemListOnSelectionChanged(context);
}
