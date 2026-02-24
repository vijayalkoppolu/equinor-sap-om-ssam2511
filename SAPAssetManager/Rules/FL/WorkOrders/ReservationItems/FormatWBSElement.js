/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function FormatWBSElement(context) {
    if (context.binding.WBSElementExternalID === '00000000' || context.binding.WBSElementExternalID === '' ) {
        return '';
    } else
    return context.binding.WBSElementExternalID;
}
