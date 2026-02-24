/**
* This function handles the button press event for the accessory button in the Packed Containers page.
* @param {IClientAPI} clientAPI
*/
export default function PackedCntnAccessoryButtonPress(clientAPI) {
    return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainersEditNav.action');
}
