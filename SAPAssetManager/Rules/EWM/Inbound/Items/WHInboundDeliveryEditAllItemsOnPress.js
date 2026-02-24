import libCom from '../../../Common/Library/CommonLibrary';
export default function WHInboundDeliveryEditAllItemsOnPress(context) {
    libCom.setStateVariable(context, 'EditAllEntryPoint', 'EditAll');
    context.executeAction('/SAPAssetManager/Rules/EWM/Inbound/Items/WHInboundDeliveryEditAllItemsPagePreNav.js');
}
