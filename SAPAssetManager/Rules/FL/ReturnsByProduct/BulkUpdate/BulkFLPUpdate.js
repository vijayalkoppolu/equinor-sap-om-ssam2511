import { getUpdatedItemsFromEDT } from './BulkFLPSave';
import libCom from '../../../Common/Library/CommonLibrary';

export default function BulkFLPUpdate(context) {
    const items = getUpdatedItemsFromEDT(context);
    const itemsUpdated = items.filter((item) => item.Properties.ItemSelection);
    return UpdateFLItemInLoop(context, itemsUpdated);
}
export function UpdateFLItemInLoop(context, items) {
    return items.reduce((prevUpdatePromise, item) => {
        return prevUpdatePromise.then(() => {
            if (libCom.getStateVariable(context, 'IsInitiateReturn')) {

                return initiateReturn(context, item.Properties, item.OdataBinding);
            } else {
                return updatePickQty(context, item.Properties, item.OdataBinding);
            }
        });
    }, Promise.resolve());
}
function updatePickQty(clientAPI, properties, binding) {

    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPUpdatePickQuantity.action',
        'Properties': {
            'Target': {
                'ReadLink': binding['@odata.readLink'],
            },
            'Properties': {
                'Product' : binding.Product,
                'FldLogsRemotePlant': binding.FldLogsRemotePlant,
                'ReferenceDocumentItem': binding.ReferenceDocumentItem,
                'FldLogsReferenceDocumentNumber': binding.FldLogsReferenceDocumentNumber,
                'FlogMaintenanceOrder': binding.FlogMaintenanceOrder,
                'RemoteStorageLocation': binding.RemoteStorageLocation,
                'FldLogsRecommendedAction': binding.FldLogsRecommendedAction,
                'SupplyingStorageLocation': binding.SupplyingStorageLocation,
                'FieldLogisticsTransferPlant': binding.FieldLogisticsTransferPlant,
                'FldLogsReturnComment': binding.FldLogsReturnComment,
                'LoadingQtyInOrderUnit': properties.LoadingQtyInOrderUnit,
                'FldLogsVoyageDestStage': properties.FldLogsVoyageDestStage,
            },
            'Headers': {
                'OfflineOData.TransactionID': `${binding.Product}${binding.FldLogsReferenceDocumentNumber}${binding.FldLogsRemotePlant}${binding.RemoteStorageLocation}${binding.FlogMaintenanceOrder}${binding.ReferenceDocumentItem}`,
            },
            'ActionResult': {
                '_Name': 'result',
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
                'UnmodifiableRequest': true,
            },
            'ValidationRule': '',
            'OnSuccess': '',
        },
    });
}
function initiateReturn(clientAPI, properties, binding) {
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPInitiateReturnUpdate.action',
        'Properties': {
            'Target': {
                'ReadLink': binding['@odata.readLink'],
            },
            'Properties': {
                'Product': binding.Product,
            'FldLogsRemotePlant': binding.FldLogsRemotePlant,
                'ReferenceDocumentItem': binding.ReferenceDocumentItem,
                'FldLogsReferenceDocumentNumber': binding.FldLogsReferenceDocumentNumber,
                'FlogMaintenanceOrder': binding.FlogMaintenanceOrder,
                'RemoteStorageLocation': binding.RemoteStorageLocation,
                'FldLogsRecommendedAction': properties.FldLogsRecommendedAction,
                'SupplyingStorageLocation': binding.SupplyingStorageLocation,
                'FieldLogisticsTransferPlant': binding.FieldLogisticsTransferPlant,
                'FldLogsReturnComment': binding.FldLogsReturnComment,
                'EntryQty': properties.EntryQty,
                'RetblQtyOrderUnit': properties.RetblQtyOrderUnit,
            },
            'ActionResult': {
                '_Name': 'result',
            },
            'OnSuccess': '',
            'OnFailure': '/SAPAssetManager/Actions/FL/Edit/SwitchResourceFailure.action',
            'ValidationRule': '',
            'Headers': {
                'OfflineOData.TransactionID': `${binding.Product}${binding.FldLogsReferenceDocumentNumber}${binding.FldLogsRemotePlant}${binding.RemoteStorageLocation}${binding.FlogMaintenanceOrder}${binding.ReferenceDocumentItem}`,
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
                'UnmodifiableRequest': true,
            },
        },
    });
}

