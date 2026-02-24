/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function IsBatchManaged(context) {
return context.binding.IsBatchManaged ? true : false;
}
