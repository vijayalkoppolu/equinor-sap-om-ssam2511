/**
* Get HU Complete status of the Physical Inventory Document
* @param {IClientAPI} clientAPI
*/
export default function GetHUComplete(context) {
    return context.binding?.HUComplCntd === 'X';
}
