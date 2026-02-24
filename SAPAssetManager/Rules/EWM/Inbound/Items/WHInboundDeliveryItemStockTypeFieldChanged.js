import libCom from '../../../Common/Library/CommonLibrary';

export default function WHInboundDeliveryItemStockTypeFieldChanged(context, binding = context.binding) {
    const stockTypeTempValue = context.getValue();
    const stockTypeMap = libCom.getStateVariable(context, 'WHIBD_EDT_StockTypeTempValueMap');

    stockTypeMap.set(binding.ItemID, stockTypeTempValue);
    libCom.setStateVariable(context, 'WHIBD_EDT_StockTypeTempValueMap', stockTypeMap);
}
