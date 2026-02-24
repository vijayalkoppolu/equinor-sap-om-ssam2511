import Logger from '../../../Log/Logger';

export default function NavigateToEWMDelivery(context, binding = context.getPageProxy().binding) {
    if (!binding?.EWMInbDel) {
        return Promise.resolve();
    }
    
    return findWarehouseInboundDelivery(context, binding.EWMInbDel)
        .then(delivery => {
            if (delivery) {
                return navigateToDeliveryDetails(context, delivery);
            }
            return Promise.resolve(); 
        })
        .catch(error => {
            Logger.error('NavigateToEWMDelivery', error);
        });
}

function findWarehouseInboundDelivery(context, deliveryNum) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveries', [], `$filter=EWMDeliveryNum eq '${deliveryNum}'`)
        .then(result => {
            return result?.length > 0 ? result.getItem(0) : null;
        })
        .catch(error => {
            Logger.error('findWarehouseInboundDelivery', error);
        });
}

function navigateToDeliveryDetails(context, delivery) {
    try {
        const deliveryDetailsPage = context.evaluateTargetPath('#Page:WHInboundDeliveryDetailsPage');
        if (deliveryDetailsPage?.binding?.EWMDeliveryNum === delivery.EWMDeliveryNum) {
            return context.getPageProxy().executeAction({
                '_Type': 'Action.Type.Navigation',
                'PageToOpen': '#Page:WHInboundDeliveryDetailsPage',
            });
        }
    } catch (error) {
        Logger.error('navigateToDeliveryDetails', error); 
    }
    
    context.getPageProxy().setActionBinding(delivery);
    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseTaskInboundDeliveryNav.action');
}
