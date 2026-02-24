export default function WHInboundDeliveryItemIsSelected(context) {
    const section = context.getPageProxy().getControls()?.[0]?.getSections()?.[0];
    const selectedItemsCount = section?.getSelectedItemsCount();
    return selectedItemsCount > 0 && section.getSelectedItems().some(item => item.binding?.['@odata.readLink'] === context.binding['@odata.readLink']);
}
