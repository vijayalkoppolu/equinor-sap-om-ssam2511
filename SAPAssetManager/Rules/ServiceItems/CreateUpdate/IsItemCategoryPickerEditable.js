
export default function IsItemCategoryPickerEditable(context) {
    const binding = context.getPageProxy().binding || {};
    const isForVehicleStock = binding['@odata.type'] === '#sap_mobile.MaterialSLoc';

    return isForVehicleStock;
}
