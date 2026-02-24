import post from './PhysicalInventoryDocItemPost';
import libCom from '../../../Common/Library/CommonLibrary';
/*
* Wrapper function for PhysicalInventoryDocItemPost
* This function is used to post the Physical Inventory Doc Item
*/
export default function PhysicalInventoryDocItemNextPostWrapper(context) {
    return post(context,false,libCom.getStateVariable(context, 'WHNextItem'));
}
