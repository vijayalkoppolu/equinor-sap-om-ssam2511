/**
* Get the HU Empty status of the PI Document.
* @param {IClientAPI} clientAPI
*/
export default function GetHUEmpty(context) {
    return context.binding?.HUEmpty === 'X';
}

