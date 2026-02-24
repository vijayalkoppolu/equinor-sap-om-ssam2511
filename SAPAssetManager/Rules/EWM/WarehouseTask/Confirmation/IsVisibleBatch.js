export default function IsVisibleBatch(context) {
    const isBatchEnabled = context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation'
        ? context.binding.WarehouseTask_Nav.IsBatchEnabled
        : context.binding.IsBatchEnabled;

    return isBatchEnabled === 'X';
}
