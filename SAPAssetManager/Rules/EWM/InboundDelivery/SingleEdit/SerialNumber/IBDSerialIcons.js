export default function IBDSerialIcons(context) {
    const icon = [];
    const checked = context.binding?.selected;
    icon.push(checked ? '/SAPAssetManager/Images/Checkbox_selected.png' : '/SAPAssetManager/Images/Check.png');
    return icon;
}
