import InboundDeliveryItemDetailsView from '../Inbound/Items/InboundDeliveryItemDetailsView';
import WHInboundDeliveryCountUnusedQuantity from '../Inbound/Items/WHInboundDeliveryCountUnusedQuantity';

export default async function WarehouseTaskCreateNavAction(context, binding = context.binding) {

    if (await WHInboundDeliveryCountUnusedQuantity(context) === '0') {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                'Properties': {
                    'OKCaption': context.localizeText('ok'),
                    'Title': context.localizeText('error'),
                    'Message': context.localizeText('whtask_no_available_qty_error'),
                },
            });
        }
    
    if (InboundDeliveryItemDetailsView(context)) {
        context.getPageProxy().setActionBinding(binding);
    }
    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseTaskCreateNav.action');
}
