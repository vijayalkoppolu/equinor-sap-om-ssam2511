import libComm from '../../../Common/Library/CommonLibrary';

/**
 * Calculate the next item number for the Warehouse Task Confirmation
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns 
 */
export default function GetWarehouseTaskConfirmationItem(context) {
    const warehouseTaskItem = context.getPageProxy()?.getClientData()?.WarehouseTaskItem;
    return warehouseTaskItem || context.evaluateTargetPath(`#Page:${libComm.getPageName(context)}/#Control:WhTaskNumSimple/#Value`).split('/')[1];
}
