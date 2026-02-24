import { InboundDeliveryStatusValue } from '../../../Common/EWMLibrary';
import libCom from '../../../../Common/Library/CommonLibrary';

export default function IsQuantityEditablePostGR(context, binding = context?.binding || context?.getPageProxy?.()?.getBindingObject?.()) {
  const editEntryPoint = libCom.getStateVariable(context, 'EditAllEntryPoint');
  const packingStatus = binding?.PackingStatusValue;
  return !(editEntryPoint === 'GoodsReceipt' && packingStatus === InboundDeliveryStatusValue.Completed);
}
