import IsQuantityEditablePostGR from './Quantity/IsQuantityEditablePostGR';

export default function WHInboundDeliveryItemEDTQuantityIsEditable(clientAPI, binding = clientAPI?.binding || clientAPI?.getPageProxy?.()?.getBindingObject?.()) {
  return !IsQuantityEditablePostGR(clientAPI, binding);
}
