import isAndroid from '../../Common/IsAndroid';

export default function ShowAccessoryButtonIcon(context) {
    if (!context.binding) {
        return '';
    }
    let icon = '';
    let query = `$filter=ReferenceDocHdr eq '${context.binding.MaterialDocNumber}' and ReferenceDocItem eq '${context.binding.MatDocItem}'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['EntryQuantity'], query).then(result => {
        const items = result?.slice() || [];
        const total = items.reduce((sum, item) => sum + item.EntryQuantity, 0);
        if (total < context.binding?.EntryQuantity) {
            icon = isAndroid(context) ? '/SAPAssetManager/Images/edit-accessory.android.png' : '/SAPAssetManager/Images/edit-accessory.ios.png';
        }
        return icon;
    });
}
