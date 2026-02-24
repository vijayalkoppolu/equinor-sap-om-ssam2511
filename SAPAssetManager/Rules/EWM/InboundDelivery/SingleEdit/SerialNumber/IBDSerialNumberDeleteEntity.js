import { GetIBDSerialNumbers } from './IBDSerialNumberLib';
import Logger from '../../../../Log/Logger';
import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function IBDSerialNumberDeleteEntity(context) {
    
    const binding = context.getPageProxy()?.binding;
    if (binding?.Serialized) {
        const serialNumberMap = GetIBDSerialNumbers(context);
        const deliveryID = binding.DocumentID;
        const itemID = binding.ItemID;
        // leaving only serials in the map that have existing entities and are not selected, to be deleted
        const serialNumberMapNew = serialNumberMap.filter(e => e.entityexist && !e.selected);
        const promises = [];

        if (serialNumberMapNew.length > 0) {

        
            serialNumberMapNew.forEach(element => {
                const serialreadlink = element.entry['@odata.readLink'];
                promises.push(context.executeAction(
                    {
                        'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
                        'Properties': {
                            'Target': {
                                'EntitySet' : 'WarehouseInboundDeliveryItemSerials',
                                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink' : serialreadlink,
                            },
                            'Headers': {
                                'OfflineOData.TransactionID': `${deliveryID}${itemID}`,        
                            },
                        },
                    }),
                ); 
            });
            return Promise.all(promises).then(result => { 
                Logger.debug(result);
                CommonLibrary.setStateVariable(context, 'IBDSerialsChanged', true);
                return Promise.resolve(result);
            }).catch(error => { 
                Logger.error('InboundDeliveryItemSerialNumberDelete', error); 
                return Promise.reject(error); 
            });
        }
    }
    return Promise.resolve();
}
