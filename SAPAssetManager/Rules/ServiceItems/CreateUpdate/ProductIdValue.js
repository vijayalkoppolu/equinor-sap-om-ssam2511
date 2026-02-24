
export default function ProductIdValue(context) {
    const binding = context.getPageProxy().binding || {};
    const isForVehicleStock = binding['@odata.type'] === '#sap_mobile.MaterialSLoc';

    return (isForVehicleStock ? binding.MaterialNum : binding.ProductID) || '';
}
