import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WCMActivityTrackerVisible(clientAPI) {
    const binding = clientAPI.getPageProxy().binding;
    const opitemType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue();
    if (opitemType === binding['@odata.type']) {
        return !CommonLibrary.isEntityLocal(binding) && binding.ItemCategoryCC !== '';
    }
    return true;
}
