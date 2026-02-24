/**
* Describe this function...
* @param {IClientAPI} context
*/
import ValidationLibrary from '../Common/Library/ValidationLibrary';
export default function FunctionalLocationHierarchyButton(context) {
    // check if there is a sub-equipment in this floc or this floc has a superior floc
    return context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Equipments', '').then(count => {
        if (count > 0 || ValidationLibrary.evalIsNotEmpty(context.binding.SuperiorFuncLoc)) {
            return 'sap-icon://tree';
        }
        return '';
    });
}
