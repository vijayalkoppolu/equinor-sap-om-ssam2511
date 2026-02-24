
export default function GetPickHUReadLinkForUpdate(context, handlingUnitValue) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehousePickHUs', [], `$filter=HandlingUnit eq '${handlingUnitValue}'&$expand=WTConfPickHU_Nav`).then(result => {
        if (result && result.length > 0) {
            return result.getItem(0)['@odata.readLink'];
        }
        return '';
    });
}
