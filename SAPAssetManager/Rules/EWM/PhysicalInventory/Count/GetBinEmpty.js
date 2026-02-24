/**
* Get the empty bin status of the bin
* @param {IClientAPI} clientAPI
*/
export default function GetBinEmpty(context) {
    return context.binding?.EmptyBin === 'X';
}
