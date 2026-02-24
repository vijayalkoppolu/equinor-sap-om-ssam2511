import post from './PhysicalInventoryDocItemPost';
import libCom from '../../../Common/Library/CommonLibrary';
/**
* Post the previous physical inventory count for the item
* @param {IClientAPI} clientAPI
*/
export default function PhysicalInventoryDocItemPreviousPost(context) {
    return post(context,false,libCom.getStateVariable(context, 'WHPreviousItem'));
}
