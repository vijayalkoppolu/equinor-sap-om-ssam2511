/**
 * This function returns the selected or unselected icon for android
 * @param {IClientAPI} clientAPI
 */
export default function SelectOrUnselectedIconShowAndroid(clientAPI) {
    return clientAPI.binding.Selected
        ? '/SAPAssetManager/Images/Checkbox_selected.png'
        : '/SAPAssetManager/Images/Check.png';
}
