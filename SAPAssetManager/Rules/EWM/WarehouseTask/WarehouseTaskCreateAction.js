import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import GenerateWarehouseTaskLocalID from './GenerateWarehouseTaskLocalID';

export default async function CreateWarehouseTask(context) {
    const binding = context.binding;

    const pageProxy = context.evaluateTargetPathForAPI('#Page:WHTaskCreatePage');
    const binvalue = pageProxy?.getControl('FormCellContainer')?.getControl('StorageBinPicker')?.getValue()[0]?.ReturnValue ?? '';
    const quantity = pageProxy?.getControl('FormCellContainer')?.getControl('WhQuantitySimple')?.getValue();
    const shortitemnum =  binding?.ItemNumber?.slice(-5);
    const whtask = await GenerateWarehouseTaskLocalID(context);
    const whNum = binding.WarehouseInboundDelivery_Nav?.WarehouseNum;
    let StorageType = '';
    let StorageSection = '';

    if (binvalue) {
        ({StorageType, StorageSection} = await readBinValues(context, binvalue));
    }

    const properties = {
        'WarehouseTask': whtask,
        'WarehouseOrder': whtask,
        'ProductDescription': binding.ProductDescription,
        'Product': binding.Product,
        'DestinationBin': binvalue,
        'DestStoreType': StorageType,
        'DestSection': StorageSection,
        'WTStatus': '/SAPAssetManager/Rules/EWM/WarehouseTask/WarehouseTaskCreateIsConfirmed.js',
        'Quantity': quantity,
        'UoM': binding.UnitofMeasure,
        'DocumentID_ext': binding.DocumentID,
        'DocumentItemID_ext': binding.ItemID,
        'EWMInbDel': binding.DocumentNumber,
        'EWMInbDelItem': binding.ItemNumber.replace(/^0+/, ''),
        'WarehouseNo': whNum,
        'CreatedBy': '/SAPAssetManager/Rules/MobileStatus/GetSAPUserId.js',
        'DocCategory': binding.DocCategory,
        'Batch': binding.BatchNumber,
        'Delivery': binding.WarehouseInboundDelivery_Nav?.LEDeliveryNum,
        'ReferenceDoc': binding.WarehouseInboundDelivery_Nav?.LEDeliveryNum,
        'PurOrder': binding.WarehouseInboundDelivery_Nav?.PurchaseOrder,
        'POItem': shortitemnum,
        'MaintenanceOrder': binding.WarehouseInboundDelivery_Nav?.MaintenanceOrder,
        'MaintOrdItem':'',
        'SerialNoRequiredLevel': '/SAPAssetManager/Rules/EWM/WarehouseTask/SerialNumber/WarehouseTaskCreateSerialCount.js',
        'ProcCategory': '1',
    };

    const createAction = {
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WarehouseTasks',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties': properties,
            'Headers': {
                'OfflineOData.RemoveAfterUpload': true,
                'OfflineOData.TransactionID': `${whtask}${whNum}`,
            },
            'CreateLinks': WarehouseTaskCreateLinks(context),
        },
        'OnFailure': '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action',
        'ShowActivityIndicator': true,
    };

    return context.executeAction(createAction).then(result => {
        const warehouseTaskReadLink = JSON.parse(result.data)['@odata.readLink'];
        libCom.setStateVariable(context, 'TaskReadLink', warehouseTaskReadLink);
        return Promise.resolve(result);
    }).catch(error => {
        Logger.error('CreateWarehouseTask', error);
        return Promise.reject(error);
    });
}

export function WarehouseTaskCreateLinks(context) {
    let links = [];

    const binding = context.binding;
    const readlink = binding?.['@odata.readLink'];
    if (readlink) {
        links.push({
            'Property': 'WarehouseInboundDeliveryItem_Nav',
            'Target': {
                'EntitySet': 'WarehouseInboundDeliveryItems',
                'ReadLink': readlink,
            },
        });
    }
    return links;
}

async function readBinValues(context, binvalue) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseStorageBins', [], `$filter=StorageBin eq '${binvalue}'`).then(result => {
        if (result.length > 0) {
            const item = result.getItem(0);
            return {
                StorageType: item.StorageType,
                StorageSection: item.StorageSection,
            };
        }
        return {
            StorageType: '',
            StorageSection: '',
        };
    });
}
