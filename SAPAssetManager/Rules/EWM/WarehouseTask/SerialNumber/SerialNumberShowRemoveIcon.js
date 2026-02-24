export default function SerialNumberShowRemoveIcon(clientAPI) {
    return clientAPI.binding.downloaded
        ? ''
        : '/SAPAssetManager/Images/xmark.png';
}
