import libCom from '../../../Common/Library/CommonLibrary';

export default function WHInboundDeliveryItemUOMFieldChanged(context, binding = context.binding) {
    const uomTempValue = context.getValue();
    const uomMap = libCom.getStateVariable(context, 'WHIBD_EDT_UOMTempValueMap');
    
    uomMap.set(binding.ItemID, uomTempValue);
    libCom.setStateVariable(context, 'WHIBD_EDT_UOMTempValueMap', uomMap);
}
