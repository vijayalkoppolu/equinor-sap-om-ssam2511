import { isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
import { GetSerialNumberMap } from './SerialNumberLib';
import Logger from '../../../Log/Logger';

/**
 * Create records for serial numbers entity which will be used later for confirmation
 * @param {IClientAPI} context
 */
export default function WarehouseTaskSerialNumberCreate(context) {
    if (isTaskWithSerialNumbers(context)) {
        const serialNumberMap = GetSerialNumberMap(context);
        // remove all enties from the map with downloaded serial numbers, leaving only created ones
        const serialNumberMapNew = serialNumberMap.filter(e => !(e.downloaded || e.usedInOtherConfirmation));
        if (serialNumberMapNew.length > 0) {    
            const promises = [];
            serialNumberMapNew.forEach(element => {
                promises.push(context.executeAction(
                    {
                        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 
                        'Properties': {
                            'Target' : {
                                'EntitySet' : 'WarehouseTaskSerialNumbers',
                                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                            },
                            'Properties' : {
                                'SerialNumber': element.entry.SerialNumber,
                                'WarehouseNo': element.entry.WarehouseNo,
                                'WarehouseTask': element.entry.WarehouseTask,
                                'Product' : element.entry.Product,
                                'UII' : '',
                            },
                            'Headers': {
                                'Transaction.Ignore': 'true',
                                'OfflineOData.RemoveAfterUpload': true,
                                'OfflineOData.TransactionID': `${element.entry.WarehouseTask}${element.entry.WarehouseNo}`,        
                            },
                            'RequestOptions': {
                                'UploadCategory': '/SAPAssetManager/Globals/EWM/TaskConfirmationUploadCategory.global',
                            },
                            'CreateLinks': [
                                {
                                    'Property': 'WTSerialNumber_Task_Nav',
                                    'Target': {
                                        'EntitySet': 'WarehouseTasks',
                                        'ReadLink': '{@odata.readLink}',
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
                return Promise.resolve(result);
            }).catch(error => { 
                Logger.error('WarehouseTaskSerialNumberCreate', error); 
                return Promise.reject(error); 
            });
        }
    }
    return Promise.resolve();
}
