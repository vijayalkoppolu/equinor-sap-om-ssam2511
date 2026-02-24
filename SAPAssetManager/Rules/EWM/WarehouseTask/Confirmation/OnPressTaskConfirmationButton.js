import { SetSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import { WarehouseTaskStatus } from '../../Common/EWMLibrary';
import Logger from '../../../Log/Logger';
import InboundDeliveryItemDetailsView from '../../Inbound/Items/InboundDeliveryItemDetailsView';

/**
 * Handler for task confirmation/deletion button
 * @param {IClientAPI} context 
 */
export default async function OnPressTaskConfirmationButton(context, pageProxy = context.getPageProxy()) {
    
    if (InboundDeliveryItemDetailsView(context)) {
        await WHTaskDelete(context, pageProxy);
    } else {
        try {
            await SetSerialNumberMap(context);
        } catch (e) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global'), `Error setting serial number map: ${e}`);
            return Promise.reject(e);
        }

        // Check if the status is confirmed
        if (context.binding.WTStatus === WarehouseTaskStatus.Confirmed) {
            // If status is confirmed, do not navigate to the confirmation page
            return Promise.resolve();
        }

        pageProxy.setActionBinding(context.binding);

        // If status is not confirmed, navigate to the confirmation page
        return pageProxy.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationNav.action');
    }
}

async function WHTaskDelete(context, pageProxy) {
    const binding = context.binding;
    const task = binding?.WarehouseTask;

    const deleteResult = await pageProxy.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
        'Properties': {
            'Title': context.localizeText('warning'),
            'Message': context.localizeText('wht_delete_confirmation_message', [task]),
            'OKCaption': context.localizeText('delete'),
            'CancelCaption': context.localizeText('cancel'),
        },
    });

    if (deleteResult.data) {
        await pageProxy.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'WarehouseTasks',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': binding['@odata.readLink'],
                },
            },
        });

        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action',
            'Properties': {
                'Message': context.localizeText('wht_delete_success_message', [task]),
            },
        });
    }
    return Promise.resolve();

}
