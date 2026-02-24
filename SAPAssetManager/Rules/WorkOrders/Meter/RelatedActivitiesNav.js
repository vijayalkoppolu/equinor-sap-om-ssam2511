import Logger from '../../Log/Logger';

export default function RelatedActivitiesNav(context) {
    const binding = context.getPageProxy().binding;
    const actType = binding.OrderISULinks[0].ISUProcess === 'DISCONNECT' ? '01' : '03';
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/DisconnectActivity_Nav', [], `$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,DisconnectDoc_Nav/DisconnectDocStatus_Nav,DisconnectDoc_Nav/ProcessVariant_Nav,DisconnectDoc_Nav/DisconnectReason_Nav&$filter=ActivityType eq '${actType}'`).then(result => {
        if (result.length) {
            context.getPageProxy().setActionBinding(result.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/RelatedActivitiesNav.action');
        }
        Logger.info('RelatedActivitiesNav', 'No DisconnectActivity');
        return Promise.resolve();
    });
}
