import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';
import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';
import WHInboundDeliveryEditAllItemsPagePreNav from './Items/WHInboundDeliveryEditAllItemsPagePreNav';
export default async function WHInboundDeliveryGoodsReceiptOnPress(context) {
    const delivery = context.getPageProxy().binding || context.binding;

    const documentID = delivery?.DocumentID;
    libCom.setStateVariable(context, 'EditAllEntryPoint', 'GoodsReceipt');
    const filter = `$filter=DocumentID eq '${documentID}'`;
    await ODataLibrary.initializeOnlineService(context);
    return context.read(
        '/SAPAssetManager/Services/OnlineAssetManager.service',
        'WarehouseGoodsReceipts',
        [],
        filter,
    ).then(results => {
        const alreadyPosted = results.some(r => r.DocumentID === documentID);
        if (alreadyPosted) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                'Properties': {
                    'OKCaption': context.localizeText('ok'),
                    'Title': context.localizeText('error'),
                    'Message': context.localizeText('ewm_goods_received_done'),
                },
            });
        }

        return context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            'WarehouseInboundDeliveryItems',
            [],
            filter,
        ).then(itemResults => {
        const allItemsCompleted = itemResults.length > 0 && itemResults.every(i => i.GRStatusValue === InboundDeliveryStatusValue.Completed);
            if (allItemsCompleted) {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                    'Properties': {
                        'OKCaption': context.localizeText('ok'),
                        'Title': context.localizeText('error'),
                        'Message': context.localizeText('ewm_goods_received_done'),
                    },
                });
            }
            return WHInboundDeliveryEditAllItemsPagePreNav(context);
        });
        }).catch(err => {
        return context.executeAction({
            Name: '/SAPAssetManager/Actions/Common/ErrorBannerMessage.action',
            Properties: {
            Message: err?.message || context.localizeText('error'),
            Duration: 2,
            Animated: true,
            _Type: 'Action.Type.BannerMessage',
            },
        });
        });
}
