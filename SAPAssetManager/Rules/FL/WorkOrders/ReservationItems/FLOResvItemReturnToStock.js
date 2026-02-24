import libcom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
export default function FLOResvItemReturnToStock(context) {

    libcom.setStateVariable(context, 'WithdrawnQty', context.binding.WithdrawnQty);
    libcom.setStateVariable(context, 'RequiredQty', context.binding.RequiredQty);
    libcom.setStateVariable(context, 'IsBatchManaged', context.binding.IsBatchManaged);
    libcom.setStateVariable(context, 'CurrentStatus', context.binding.Status);
    libcom.setStateVariable(context, 'RequestedQty', context.getPageProxy().getControl('FormCellContainer').getControl('WithdrawnQuantity').getValue());
    if (libcom.getStateVariable(context, 'BulkFLUpdateNav')) {
        let withdrawnQty = context.binding.WithdrawnQty;
        const screenQty = Number(context.getPageProxy().getControl('FormCellContainer').getControl('WithdrawnQuantity').getValue());
        if (context.binding.EntryQty !== screenQty && context.binding.EntryQty !== 0) {
            withdrawnQty = context.binding.WithdrawnQty + (context.binding.EntryQty - screenQty);
        }
        libcom.setStateVariable(context, 'EntryQtyOld', context.binding.EntryQty);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/FL/WorkOrders/FLOResvItemReturnToStock.action',
            'Properties': {
                'Target': {
                    'ReadLink': context.binding['@odata.readLink'],
                },
                'Properties': {
                    'WithdrawnQty': withdrawnQty,
                },
                'OnSuccess': '',
            },
        }).then(() => {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/FL/WorkOrders/FLOProductReturnToStockSuccess.action',
                'Properties': {
                    'OnSuccess': '',
                },
            });
        }).then(() => {
            const actionProperties = {
                'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action',
                'Properties': {
                    'Message': context.localizeText('update_successful'),
                    'OnSuccess': '/SAPAssetManager/Rules/FL/BulkUpdate/BulkUpdateClosePage.js',
                },
            };
            return context.executeAction(actionProperties).catch(error => {
                Logger.error('FLUpdate', error);
            });
        });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLOResvItemReturnToStock.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLOProductReturnToStockSuccess.action');
        });
    }
}



