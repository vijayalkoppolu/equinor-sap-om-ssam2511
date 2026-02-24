import { generateHandlingUnitsList } from './WHHandlingUnitCreateSpecifyQuantityTableNav';
import GenerateLocalID from '../../../../Common/GenerateLocalID';
import libCommon from '../../../../Common/Library/CommonLibrary';
import { validateQty } from './WHHandlingUnitCreateQtyChange';
import Logger from '../../../../Log/Logger';
import { InboundDeliveryStatusValue } from '../../../Common/EWMLibrary';
import WHInboundDeliveryPackingStatus from '../../WHInboundDeliveryPackingStatus';

export default async function WHHandlingUnitCreate(context) {
    const pageName = libCommon.getPageName(context);

    if (pageName === 'WHHandlingUnitMixedCreatePage') {
        return createHandlingUnitsMixed(context);
    }

    return createHandlingUnits(context);
}

async function createHandlingUnits(context) {
    const formCellContainer = context.getControl('FormCellContainer');
    const qtyToPackControl = formCellContainer.getControl('QtyToPack');
    const numberOfHUsControl = formCellContainer.getControl('NumberOfHUs');
    const packableItemsCount = +formCellContainer.getControl('QtyToPack').getValue();
    const handlingUnitsCount = +formCellContainer.getControl('NumberOfHUs').getValue();

    context.showActivityIndicator();

    try {
        await Promise.all([
            validateQty(numberOfHUsControl, formCellContainer),
            validateQty(qtyToPackControl, formCellContainer),
        ]);


        const clientData = context.getClientData();

        let items = [];

        if (handlingUnitsCount === 1) {
            items.push({
                qty: packableItemsCount,
                uom: context.binding.UnitofMeasure,
                number: formCellContainer.getControl('HUNumber').getValue() || '',
            });
        } else {
            items = clientData.items || generateHandlingUnitsList(context, packableItemsCount, formCellContainer);
        }

        for (const item of items) {
            clientData.CreatableHU = {
                ...await generateHandlingUnitHeaderData(context, formCellContainer, item),
                Items: [
                    {
                        ItemBinding: context.binding,
                        StockGUID: await GenerateLocalID(context, 'HandlingUnitItems', 'StockGUID', '00000', "$filter=startswith(StockGUID, 'LOCAL') eq true", 'LOCAL_HUI'),
                        PackedQuantity: item.qty,
                        QuantityUoM: item.uom,
                        RefDocId: context.binding.DocumentID,
                        RefItemId: context.binding.ItemID,
                        HandlingUnitItemLinks: generateHandlingUnitItemNavLinks(context.binding['@odata.readLink']),
                    },
                ],
            };

            await context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/HandlingUnit/WHHandlingUnitCreateChangeSet.action');
        }

        await updateWarehouseInboundDeliveryItemQtyStatus(context, context.binding, packableItemsCount);

        context.dismissActivityIndicator();

        await context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        await context.executeAction({
            Name: '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action',
            Properties: {
                Message: context.localizeText('hu_created_successfully'),
            },
        });
        await updateWarehouseInboundDeliveryStatus(context, context.binding.WarehouseInboundDelivery_Nav['@odata.readLink']);
    } catch (error) {
        context.dismissActivityIndicator();
        Logger.error('createHandlingUnits creating handling units error:', error);
    }
}

export async function updateWarehouseInboundDeliveryItemQtyStatus(context, binding, packableItemsCount) {
    const openPackableQuantity = binding.OpenPackableQuantity - packableItemsCount;
    const packedQuantity = binding.PackedQuantity + packableItemsCount;
    let packingStatusValue = binding.PackingStatusValue;
    let packingStatus = binding.PackingStatus;

    if (openPackableQuantity === 0) {
        packingStatusValue = InboundDeliveryStatusValue.Completed;
    } else if (packedQuantity === 0) {
        packingStatusValue = InboundDeliveryStatusValue.NotStarted;
    } else {
        packingStatusValue = InboundDeliveryStatusValue.Partial;
    }

    packingStatus = WHInboundDeliveryPackingStatus(context, packingStatusValue);


    await context.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        Properties: {
            Target: {
                EntitySet: 'WarehouseInboundDeliveryItems',
                Service: '/SAPAssetManager/Services/AssetManager.service',
                ReadLink: binding['@odata.readLink'],
            },
            Properties: {
                OpenPackableQuantity: openPackableQuantity,
                PackedQuantity: packedQuantity,
                PackingStatusValue: packingStatusValue,
                PackingStatus: packingStatus,
            },
            Headers: {
                'Transaction.Ignore': 'true',
            },
        },
    });
}

export async function updateWarehouseInboundDeliveryStatus(context, readLink) {
    const items = await context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/WarehouseInboundDeliveryItem_Nav`, [], '$select=PackingStatusValue');
    const itemsStatusMapping = items.reduce((acc, item) => {
        acc[item.PackingStatusValue] = (acc[item.PackingStatusValue] || 0) + 1;

        return acc;
    }, {
        [InboundDeliveryStatusValue.NotStarted]: 0,
        [InboundDeliveryStatusValue.Partial]: 0,
        [InboundDeliveryStatusValue.Completed]: 0,
        [InboundDeliveryStatusValue.NotRelevant]: 0,
    });

    const countableItemsCount = items.length - itemsStatusMapping[InboundDeliveryStatusValue.NotRelevant];
    let packingStatusValue = InboundDeliveryStatusValue.NotRelevant;

    if (countableItemsCount === itemsStatusMapping[InboundDeliveryStatusValue.Completed]) {
        packingStatusValue = InboundDeliveryStatusValue.Completed;
    } else if (countableItemsCount === itemsStatusMapping[InboundDeliveryStatusValue.NotStarted]) {
        packingStatusValue = InboundDeliveryStatusValue.NotStarted;
    } else {
        packingStatusValue = InboundDeliveryStatusValue.Partial;
    }

    const packingStatus = WHInboundDeliveryPackingStatus(context, packingStatusValue);

    await context.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        Properties: {
            Target: {
                EntitySet: 'WarehouseInboundDeliveries',
                Service: '/SAPAssetManager/Services/AssetManager.service',
                ReadLink: readLink,
            },
            Properties: {
                PackingStatusValue: packingStatusValue,
                PackingStatus: packingStatus,
            },
            Headers: {
                'Transaction.Ignore': 'true',
            },
        },
    });
}


async function createHandlingUnitsMixed(context) {
    const sectionsEDT = context.getPageProxy().getControls()[0].getSections().filter(sec => sec.getName() === 'EditableDataTableExtensionSection');

    context.showActivityIndicator();

    const clientData = context.getClientData();
    const items = [];

    let isDataValid = true;

    for (let idx = 0; idx < sectionsEDT.length; idx++) {
        const section = sectionsEDT[idx];
        const extension = section.getExtension();
        const item = extension.getAllValues()[0];

        const { qty, uom } = item.Properties;

        if (!qty) {
            extension.getCell(0, 1).applyValidation(context.localizeText('field_is_required'));
            isDataValid = false;
        }

        if (qty > item.OdataBinding.OpenPackableQuantity) {
            extension.getCell(0, 1).applyValidation(context.localizeText('validation_value_less_or_equal_than_open_packable_quantity'));
            isDataValid = false;
        }

        items.push({
            ItemBinding: item.OdataBinding,
            StockGUID: await GenerateLocalID(context, 'HandlingUnitItems', 'StockGUID', '00000', "$filter=startswith(StockGUID, 'LOCAL') eq true", 'LOCAL_HUI', undefined, idx),
            PackedQuantity: qty,
            QuantityUoM: uom,
            RefDocId: context.binding.inboundDelivery.DocumentID,
            RefItemId: item.OdataBinding.ItemID,
            HandlingUnitItemLinks: generateHandlingUnitItemNavLinks(item.OdataBinding['@odata.readLink']),
        });
    }

    if (!isDataValid) {
        context.dismissActivityIndicator();
        return Promise.reject(context.localizeText('validation_error'));
    }

    clientData.CreatableHU = {
        ...await generateHandlingUnitHeaderData(context, context.getControl('FormCellContainer')),
        Items: items,
    };

    await context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/HandlingUnit/WHHandlingUnitCreateChangeSet.action');

    for (const item of clientData.CreatableHU.Items) {
        await updateWarehouseInboundDeliveryItemQtyStatus(context, item.ItemBinding, item.PackedQuantity);
    }

    context.dismissActivityIndicator();

    await context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');

    return context.executeAction({
        Name: '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action',
        Properties: {
            Message: context.localizeText('hu_created_successfully'),
        },
    }).then(async () => {
        context.currentPage.context.clientAPI.getControls()[0].getSections()[0].setSelectionMode('None');
        await updateWarehouseInboundDeliveryStatus(context, context.binding.inboundDelivery['@odata.readLink']);
    });
}

async function generateHandlingUnitHeaderData(context, formCellContainer, item) {
    const material = formCellContainer.getControl('PackagingMaterialPicker').getValue()[0];

    return {
        GUID: await GenerateLocalID(context, 'HandlingUnits', 'GUID', '00000', "$filter=startswith(GUID, 'LOCAL') eq true", 'LOCAL_HU'),
        HUType: libCommon.getListPickerValue(formCellContainer.getControl('HUTypePicker').getValue()),
        PackingMaterial: material.ReturnValue,
        PackingMaterialDesc: material.BindingObject.PackagingMaterialDescription,
        HandlingUnit: item?.number || formCellContainer.getControl('HUNumber').getValue() || '',
    };
}

function generateHandlingUnitItemNavLinks(ibdItemReadLink) {
    return [
        {
            Property: 'InboundDeliveryItem_Nav',
            Target: {
                EntitySet: 'WarehouseInboundDeliveryItems',
                ReadLink: ibdItemReadLink,
            },
        },
        {
            Property: 'Header_Nav',
            Target: {
                EntitySet: 'HandlingUnits',
                ReadLink: 'pending_1',
            },
        },
    ];
}
