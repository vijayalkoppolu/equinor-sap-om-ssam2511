import libCommon from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function TemplateVisibility(control) {
    const pageProxy = control.getPageProxy();
    const isOnCreate = libCommon.IsOnCreate(pageProxy);
    const isValuePresent = !(ValidationLibrary.evalIsEmpty(pageProxy.binding)) && pageProxy.binding.CopyEquipId;

    if (!isOnCreate && !!isValuePresent) {
        return control.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${isValuePresent}')`, [], '').then(response => { 
            let referencedEquipment = response.getItem(0);
            return !ODataLibrary.hasAnyPendingChanges(referencedEquipment);
        });
    }
    return !isOnCreate && !!isValuePresent;
}
