
export default function WHHandlingUnitNumberScanOnSuccess(context) {
    const scanResult = context.getActionResult('BarcodeScanner')?.data;
    const pageProxy = context.getPageProxy();
    const clientData = pageProxy.getClientData();
    const cellToBeFilled = clientData.cellToBeFilled;

    clientData.cellToBeFilled = undefined;

    if (cellToBeFilled && scanResult) {
        const edtControl = pageProxy.getControls()[0].getSections()[0].getExtension();
        const cell = edtControl.getCell(...cellToBeFilled);

        if (cell) {
            cell.setValue(scanResult);
        }
    }
}
