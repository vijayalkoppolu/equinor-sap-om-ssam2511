import { getUpdatedItemsFromEDT } from './BulkFLWOSave';
import { FldLogsWOProductStatus, FLEntityNames } from '../../Common/FLLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
/**
* Updates the FL Work Orders in bulk.
* This function iterates through the updated items and performs the necessary updates based on the item type
* @param {IClientAPI} clientAPI
*/
export default function BulkFLWOUpdate(context) {
    const items = getUpdatedItemsFromEDT(context);
    const itemsUpdated = items.filter((item) => item.Properties.ItemSelection);
    return UpdateFLItemInLoop(context, itemsUpdated);
}
export function UpdateFLItemInLoop(context, items) {
    return items.reduce((prevUpdatePromise, item) => {
        return prevUpdatePromise.then(() => {
            const type = item.OdataBinding['@odata.type'].substring('#sap_mobile.'.length);
            if (type === FLEntityNames.WoProduct) {
                return returnFromProduct(context, item.Properties, item.OdataBinding);
            } else {
                return returnFromReservation(context, item.Properties, item.OdataBinding);
            }
        });
    }, Promise.resolve());
}
function returnFromReservation(clientAPI, properties, binding) {
    const itemNav = libCom.getStateVariable(clientAPI, 'BulkFLUpdateNav');
    let withdrawnQty = binding.WithdrawnQty;
    let updatedQty = 0;
    let update = false;
    if ( Number(binding.EntryQty) !== properties.Quantity ) {
        if (binding.EntryQty === 0) {
             withdrawnQty = Number(binding.WithdrawnQty - properties.Quantity);
        } else { 
            updatedQty = Number(binding.EntryQty - properties.Quantity);
            withdrawnQty = Number(binding.WithdrawnQty + updatedQty); 
        } 
      update = true;
     
    }
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/FL/WorkOrders/FLOResvItemReturnToStock.action',
        'Properties': {
            'Target': {
                'ReadLink': binding['@odata.readLink'],
            },
            'Properties': {
                'EntryQty': properties.Quantity,
                'WithdrawnQty': (!update) ? binding.WithdrawnQty:withdrawnQty,
                'Status': (itemNav) ? '' : withdrawnQty > 0 ? '' : FldLogsWOProductStatus.Returned,
                'RemoteStorageLocation' : properties.StorageLocation,
                'SerialNumber' : binding.SerialNumber,
                'Batch' : binding.Batch,
                'ValuationType' : binding.ValuationType,
                'Reservation' : binding.Reservation,
                'AcctAssgmtCat': binding.AcctAssgmtCat,
                'ItemCategory': binding.ItemCategory,
                'Product': binding.Product,
                'Order': binding.Order,
            },
            'Headers': {
                'OfflineOData.TransactionID':`${binding.Order}${binding.Product}${binding.Operation}${binding.Plant}`,
            },
            'ValidationRule':'',
            'OnSuccess': '',
        },
    }).then(() => {
        const product = binding.Product;
        const order = binding.Order;
        const operation = binding.Operation;
        const plant = binding.Plant;
        const itemQuery = `$filter=Product eq '${product}' and Order eq '${order}' and Operation eq '${operation}' and Plant eq '${plant}'`;
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWoProducts', [], itemQuery).then(function(result) {
            if (!libVal.evalIsEmpty(result)) {
                let items = result._array;
                for (let item of items) {
                    let productQuantity = binding.WithdrawnQty;
                    if (update) {
                         if (binding.EntryQty === 0) {
                           productQuantity = item.WithdrawnQty - properties.Quantity;
                         } else  {
                            productQuantity = item.WithdrawnQty + updatedQty;
                        } 
                    }
                   
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/FL/WorkOrders/FLOProductReturnToStock.action',
                        'Properties': {
                            'Target': {
                                'ReadLink': item['@odata.readLink'],
                            },
                            'Properties': {
                                'RemoteStorageLocation': properties.StorageLocation,
                                'Reservation': binding.Reservation,
                                'Status': itemNav ? '' : productQuantity > 0 ? '' : FldLogsWOProductStatus.Returned,
                                'WithdrawnQty': (!update) ? binding.WithdrawnQty : productQuantity,
                                'EntryQty': 0,
                            },
                            'ActionResult': {
                                '_Name': 'result',
                            },
                            'OnSuccess': '',
                            'OnFailure': '/SAPAssetManager/Actions/FL/Edit/SwitchResourceFailure.action',
                            'ValidationRule': '',
                            'Headers': {
                                'Transaction.Ignore': true,
                                'OfflineOData.TransactionID': `${binding.Order}${binding.Product}${binding.Operation}${binding.Plant}`,
                            
                            },
                        },
                    });
                }
            }
            return Promise.resolve(true);
        });
    });
}
function returnFromProduct(clientAPI, properties, binding) {
    const itemNav = libCom.getStateVariable(clientAPI, 'BulkFLUpdateNav');
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/FL/WorkOrders/FLOProductReturnToStock.action',
        'Properties': {
            'Target': {
                'ReadLink': binding['@odata.readLink'],
            },
            'Properties': {
                'RemoteStorageLocation': properties.StorageLocation,
                'Reservation': binding.Reservation,
                'Status': itemNav ? '' : FldLogsWOProductStatus.Returned,
                'WithdrawnQty': itemNav ? binding.WithdrawnQty : 0,
                'EntryQty': binding.EntryQty ? binding.EntryQty : binding.WithdrawnQty,
            },
            'ActionResult': {
                '_Name': 'result',
            },
            'OnSuccess': '',
            'OnFailure': '/SAPAssetManager/Actions/FL/Edit/SwitchResourceFailure.action',
            'ValidationRule': '',
            'Headers': {
                'OfflineOData.TransactionID': `${binding.Order}${binding.Product}${binding.Operation}${binding.Plant}`,
            },
        },
    }).then(() => {
        const product = binding.Product;
        const order = binding.Order;
        const operation = binding.Operation;
        const plant = binding.Plant;
        const query = `$filter=Product eq '${product}' and Order eq '${order}' and Operation eq '${operation}' and Plant eq '${plant}'`;
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWoResvItems', [], query).then(function(result) {
            if (!libVal.evalIsEmpty(result)) {
                let items = result._array;
                for (let item of items) {
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/FL/WorkOrders/FLResvItemReturnToStockSuccess.action',
                        'Properties': {
                            'Target': {
                                'ReadLink': item['@odata.readLink'],
                            },
                            'Properties': {
                                'WithdrawnQty': itemNav ? binding.WithdrawnQty : 0,
                                'EntryQty': 0,
                                'Status': itemNav ? '' : FldLogsWOProductStatus.Returned,
                            },
                            'Headers': {
                                'Transaction.Ignore': true,
                                'OfflineOData.TransactionID': `${binding.Order}${binding.Product}${binding.Operation}${binding.Plant}`,
                            
                            },
                            'OnSuccess': '',
                        },
                    });
                }
            }
            return Promise.resolve(true);
        });
    });
}


