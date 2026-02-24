import libCom from '../../../Common/Library/CommonLibrary';

export default function WHInboundDeliveryItemQuantityFieldChanged(context, binding = context.binding) {
    const quantityTempValue = context.getValue();
    const quantityMap = libCom.getStateVariable(context, 'WHIBD_EDT_QuantityTempValueMap');

    quantityMap.set(binding.ItemID, quantityTempValue);
    libCom.setStateVariable(context, 'WHIBD_EDT_QuantityTempValueMap', quantityMap);
}
