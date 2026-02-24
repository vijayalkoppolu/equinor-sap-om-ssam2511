export default function OnDestBinSelectAction(context) {
    const destBinValue = context.binding?.StorageBin;
    const previousPage = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
    const confirmationFormCellSection = previousPage?.getControls('FormCellContainer');
    const TextBoxControl = confirmationFormCellSection[0]?.getControl('WhDestinationBinSimple');

    if (TextBoxControl) {
        TextBoxControl.setValue(destBinValue);
        return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
    } else {
        return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/DestinationBin/WarehouseTaskDestinationBinSelectFailed.action');
    }
}
