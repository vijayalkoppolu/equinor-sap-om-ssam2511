export default async function WHHandlingUnitNumberScan(context) {
    const cell = context._control;
    const table = cell.getTable();
    const pageProxy = table.context.clientAPI.getPageProxy();

    pageProxy.getClientData().cellToBeFilled = [cell.getRow(), cell.getColumn() - 1];

    return pageProxy.executeAction('/SAPAssetManager/Actions/EWM/Inbound/HandlingUnit/WHHandlingUnitNumberScan.action');
}
