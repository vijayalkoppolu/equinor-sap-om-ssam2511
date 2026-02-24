export default function IsVisibleHandlingUnitButton(context) {
    let skipPickHU;
    if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        skipPickHU = context.binding.WarehouseTask_Nav.SkipPickHU;
    } else {
        skipPickHU = context.binding.SkipPickHU;
    }

    return !(skipPickHU === 'A' || skipPickHU === 'B' || skipPickHU === 'Y');
}
