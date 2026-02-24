export default function GetSourceBinForHU(context) {

    if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        return context.binding.WarehouseTask_Nav.SourceBin;
    } else {
        return context.binding.SourceBin;
    }
}
