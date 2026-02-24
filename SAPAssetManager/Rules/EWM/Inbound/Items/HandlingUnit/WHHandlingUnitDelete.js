import { updateWarehouseInboundDeliveryItemQtyStatus, updateWarehouseInboundDeliveryStatus } from './WHHandlingUnitCreate';
import Logger from '../../../../Log/Logger';

export default async function WHHandlingUnitDelete(context) {
    const pageProxy = context.getPageProxy();
    const binding = context.binding;
    const header = binding.Header_Nav;
    const number = header.HandlingUnit || header.GUID;

    const deleteResult = await pageProxy.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
        'Properties': {
            'Title': context.localizeText('warning'),
            'Message': context.localizeText('hu_delete_confirmation_message', [number]),
            'OKCaption': context.localizeText('delete'),
            'CancelCaption': context.localizeText('cancel'),
        },
    });

    if (deleteResult.data) {
        context.showActivityIndicator();

        try {
            await pageProxy.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'HandlingUnits',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': header['@odata.readLink'],
                    },
                },
            });

            for (const item of header.HandlingUnitItem_Nav) {
                await updateWarehouseInboundDeliveryItemQtyStatus(context, item.InboundDeliveryItem_Nav, -item.PackedQuantity);
            }
        } catch (error) {
            Logger.error('WHHandlingUnitDelete', `Error deleting HU: ${error}`);
        } finally {
            context.dismissActivityIndicator();
        }

        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action',
            'Properties': {
                'Message': context.localizeText('hu_delete_success_message', [number]),
            },
        });

        await updateWarehouseInboundDeliveryStatus(context, pageProxy.binding.WarehouseInboundDelivery_Nav['@odata.readLink']);
    }
}
