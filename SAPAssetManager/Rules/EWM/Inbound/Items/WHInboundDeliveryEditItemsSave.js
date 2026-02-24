import WHInboundDeliveryCheckQuantityValidity from './WHInboundDeliveryCheckQuantityValidity';
import WHInboundDeliveryCheckUOMValidity from './WHInboundDeliveryCheckUOMValidity';
import WHInboundDeliveryCheckStockTypeValidity from './WHInboundDeliveryCheckStockTypeValidity';
import libCom from '../../../Common/Library/CommonLibrary';

export default async function WHInboundDeliveryEditItemsSave(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    const editEntryPoint = libCom.getStateVariable(context, 'EditAllEntryPoint');

    for (let s_index = 2; s_index <= sections.length; s_index += 2) {
        let section = sections[s_index - 1];
        let edt = section.getExtension();

        const quantity = edt.getRowCellByName(0, 'Quantity');
        const uom = edt.getRowCellByName(0, 'UOM');
        const stockType = edt.getRowCellByName(0, 'StockType');
        const detailsButton = edt.getRowCellByName(0, 'DetailsButton');

        quantity.clearValidation();
        uom.clearValidation();
        stockType.clearValidation();

        let quantityIsValid = true;
        let uomIsValid = true;
        let stockTypeIsValid = true;
        if (quantity.isModified()) {
            quantityIsValid = await WHInboundDeliveryCheckQuantityValidity(context, quantity);
        }
        if (uom.isModified()) {
            uomIsValid = WHInboundDeliveryCheckUOMValidity(context, uom);
        }
        if (stockType.isModified()) {
            stockTypeIsValid = WHInboundDeliveryCheckStockTypeValidity(context, stockType);
        }

        if (!quantityIsValid || !uomIsValid || !stockTypeIsValid) {
            return;
        }

        if (editEntryPoint === 'GoodsReceipt' && quantity.context.binding.Serialized === 'X') {
            const documentID = quantity.context.binding.DocumentID;
            const itemID = quantity.context.binding.ItemID;
            const expectedCount = parseFloat(quantity.context.binding.Quantity);
            const serials = await context.read(
                '/SAPAssetManager/Services/AssetManager.service',
                'WarehouseInboundDeliveryItemSerials',
                [],
                `$filter=DocumentID eq '${documentID}' and ItemID eq '${itemID}'`,
            );

            if (serials.length !== expectedCount) {
                quantity.context.binding.hasErrors = true;
                quantity.context.binding._ErrorReason  = 'MissingSerials';
                quantity.context.binding._ErrorMessage = context.localizeText('accept_all_error');

                detailsButton.applyValidation(context.localizeText('accept_all_error'));
                return;
            }
        }

        if (editEntryPoint === 'GoodsReceipt' && quantity.context.binding.BatchManaged === 'X') {
            const batchNumber = quantity?.context?.binding?.BatchNumber;

            if (!batchNumber || batchNumber.length === 0) {
                quantity.context.binding.hasErrors = true;
                quantity.context.binding._ErrorReason = 'MissingBatch';
                quantity.context.binding._ErrorMessage = context.localizeText('ewm_batch_number_missing');
                detailsButton.applyValidation(context.localizeText('ewm_batch_number_missing'));
                return;
            }
        }

        if (quantity.isModified() || uom.isModified() || stockType.isModified()) {
            const readLink = quantity.context.readLink;
            const documentID = quantity.context.binding.documentID;
            await context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'WarehouseInboundDeliveryItems',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': readLink,
                    },
                    'Headers': {
                        'OfflineOData.TransactionID': documentID,
                    },
                    'Properties': {
                        'Quantity': quantity.getValue(),
                        'UnitofMeasure': uom.getValue(),
                        'StockType': stockType.getValue(),
                    },
                },
            });
        }
    }

    if (editEntryPoint === 'GoodsReceipt') {
        await context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/WHInboundDeliveryPostGoodsReceipt.action');
    } else {
        await context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/WHInboundDeliveryEditItemsSaveSucc.action');
    }
    await context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
}
