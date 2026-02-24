
import EnableCharEdit from '../../UserAuthorizations/Characteristics/EnableCharEdit';
import ODataLibrary from '../../OData/ODataLibrary';

export default function EnableAddCharLAMValue(context) {
    const binding = context.getPageProxy().binding;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'ClassCharacteristics', `$filter=InternCharNum eq '${binding.CharId}' and InternClassNum eq '${binding.InternClassNum}' and LAMEnabled eq 'X'`).then(count => {
        let local = ODataLibrary.hasAnyPendingChanges(context.binding);
        return !local && EnableCharEdit(context) && (count > 0);
    });
}
