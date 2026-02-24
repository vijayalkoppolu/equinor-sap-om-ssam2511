import libCommon from '../../../Common/Library/CommonLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function ReferenceVisibility(control) {
    const pageProxy = control.getPageProxy();
    const isOnCreate = libCommon.IsOnCreate(pageProxy);
    const isValuePresent = pageProxy.binding.CopyFuncLocIdIntern;

    if (!isOnCreate && !!isValuePresent) {
        return control.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${isValuePresent}')`, [], '').then(response => { 
            if (response && response.length > 0) {
                let referencedFLOC = response.getItem(0);
                return !!ODataLibrary.hasAnyPendingChanges(referencedFLOC);
            }
            return false;
        });
    }
    return !isOnCreate && !!isValuePresent;
}
