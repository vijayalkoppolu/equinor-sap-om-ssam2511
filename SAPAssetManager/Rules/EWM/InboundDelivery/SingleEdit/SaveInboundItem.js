import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import libVal from '../../../Common/Library/ValidationLibrary';

export default async function SaveInboundItem(context) {
    const pageProxy = context.getPageProxy?.() || context;
    const binding = pageProxy.getBindingObject();

    const formCellSection = pageProxy.getControl('EditInboundDeliveryTable');
    const packedQuantity = Number(binding.PackedQuantity || 0);
    const rawQuantity = formCellSection.getControl('QuantityInput').getValue();
    const quantity = Number(rawQuantity);
    const uom = formCellSection.getControl('UOM').getValue()[0]?.ReturnValue ?? '';
    const stockType = formCellSection.getControl('StockType').getValue()[0]?.ReturnValue ?? '';
    const batch = formCellSection.getControl('Batch').getValue()[0]?.ReturnValue ?? '';
    if (quantity < packedQuantity || libVal.evalIsEmpty(rawQuantity) ) {
        return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/Validation/QuantityErrorMessage.action');
    }
    try {
        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'WarehouseInboundDeliveryItems',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': binding['@odata.readLink'],
                },
                'Properties': {
                    'Quantity': quantity,
                    'UnitofMeasure': uom,
                    'StockType': stockType,
                    'BatchNumber': batch,
                    'OpenPackableQuantity': Math.max(quantity - packedQuantity, 0),
                },
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                },
            },
        });
        CommonLibrary.setStateVariable(context, 'IBDSerialsChanged', false);
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    } catch (error) {
        Logger.error('InboundDeliveryItemUpdate', error);
    }
}
