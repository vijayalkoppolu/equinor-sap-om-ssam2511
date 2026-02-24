import libCom from '../../../Common/Library/CommonLibrary';

import WHInboundDeliveryEditItemsPageMetadataGenerator from './WHInboundDeliveryEditItemsPageMetadataGenerator';
import { InboundDeliveryStatusValue } from '../../Common/EWMLibrary';

export default function WHInboundDeliveryEditAllItemsPagePreNav(context) {
    const pageMetadata = WHInboundDeliveryEditItemsPageMetadataGenerator(context);
    const binding = context.binding || context.getActionBinding();
    libCom.setStateVariable(context, 'WHIBD_EDT_QuantityTempValueMap', new Map());
    libCom.setStateVariable(context, 'WHIBD_EDT_UOMTempValueMap', new Map());
    libCom.setStateVariable(context, 'WHIBD_EDT_StockTypeTempValueMap', new Map());

    if (binding.GRStatusValue === InboundDeliveryStatusValue.Completed) {
        return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/WHInboundDeliveryGRCompletedMessage.action');
    }
    if (binding.PackingStatusValue === InboundDeliveryStatusValue.Completed) {
        return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/WHInboundDeliveryPackingCompletedMessage.action');
    }

    return context.executeAction({
        Name: '/SAPAssetManager/Actions/EWM/Inbound/WHInboundDeliveryEditAllItemsPageNav.action',
        Properties: {
            PageMetadata: pageMetadata,
        },
    });
}
