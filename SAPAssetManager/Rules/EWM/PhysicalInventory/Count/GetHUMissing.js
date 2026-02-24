/**
* Get the HU Missing flag of the Physical Inventory Document
* @param {IClientAPI} clientAPI
*/
export default function GetHUMissing(context) {
    return context.binding?.NoHU === 'X';
}
