/**
* This function get the Physical inventory date and navigates to the count page
* @param {IClientAPI} clientAPI
*/
export default function PICountNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=WarehousePhysicalInventoryItemSerial_Nav').then(function(results) {
        if (results && results.length > 0) {
            context.getPageProxy().setActionBinding(results.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/EWM/PhysicalInventory/PhysicalInvCountNav.action');
        }
        return '';
    });
}
