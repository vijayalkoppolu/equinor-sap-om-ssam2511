/**
 * This function returns the Physical Inventory Document Number and the Document Year
 */
export default function PhysicalInventoryDocAndDescription(context) {
    let binding = context.binding;
    return binding ? `${binding?.PIDocumentNo}/${binding?.DocumentYear}` : '-';
}
