export default function GetHandlingUnitValue(context) {

    // for local update scenarios, we need to get the HU from the warehousetaskconfirmation entity
     if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        return context.binding.DestHU ? context.binding.DestHU : context.binding.WarehousePickHUTaskC_Nav.HandlingUnit;
    } else if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTask') {
        return context.binding.DestinationHU;
    } else {
    return '';
    }

}
