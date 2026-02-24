import { GetIBDSerialNumbers } from './IBDSerialNumberLib';
import Logger from '../../../../Log/Logger';
import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function IBDSerialNumberCreateEntity(context, binding = context.getPageProxy().binding) {
    if (binding?.Serialized) {
        const serialNumberMap = GetIBDSerialNumbers(context);
        // leave the new map with only not existing, selected serial numbers to be created
        const serialNumberMapNew = serialNumberMap.filter(e => !e.entityexist && e.selected);

        if (serialNumberMapNew.length > 0) {
            const promises = [];
            const deliveryID = binding.DocumentID;
            const itemID = binding.ItemID;
            serialNumberMapNew.forEach(element => {
                promises.push(context.executeAction(
                    {
                        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 
                        'Properties': {
                            'Target' : {
                                'EntitySet' : 'WarehouseInboundDeliveryItemSerials',
                                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                            },
                            'Properties' : {
                                'DocumentID': deliveryID,
                                'ItemID': itemID,
                                'SerialNumber': element.entry.SerialNumber,
                            },
                            'Headers': {
                                'OfflineOData.RemoveAfterUpload': true,
                                'OfflineOData.TransactionID': `${deliveryID}${itemID}`,        
                            },
                            'CreateLinks': [
                                {
                                    'Property': 'WarehouseInboundDeliveryItem_Nav',
                                    'Target': {
                                        'EntitySet': 'WarehouseInboundDeliveryItems',
                                        'ReadLink': binding['@odata.readLink'],
                                    },
                                },
                            ],
                            'ActionResult': {
                                '_Name': 'result',
                            },
                        },
                    }));
            });
                return Promise.all(promises).then(result => { 
                Logger.debug(result);
                CommonLibrary.setStateVariable(context, 'IBDSerialsChanged', true);
                return Promise.resolve(result);
            }).catch(error => { 
                Logger.error('InboundDeliveryItemSerialNumberCreate', error); 
                return Promise.reject(error); 
            });
        }
    }
    return Promise.resolve();

}
