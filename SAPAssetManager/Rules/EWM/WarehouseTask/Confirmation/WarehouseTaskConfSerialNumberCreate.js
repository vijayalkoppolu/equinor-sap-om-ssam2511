import { isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
import { GetSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import { default as GetWarehouseTaskConfirmationItem } from  './GetWarehouseTaskConfirmationItem';
import Logger from '../../../Log/Logger';
import libCom from '../../../Common/Library/CommonLibrary';
/**
 * Create confirmation records for confirmed serial numbers
 * @param {IClientAPI} context
 */
export default function WarehouseTaskConfSerialNumberCreate(context) {
    const task =  libCom.getStateVariable(context, 'WarehouseTask');
    if (isTaskWithSerialNumbers(context,task)) {
        const serialNumberMap = GetSerialNumberMap(context);
        if (serialNumberMap) {    
            const taskConfirmationItem = GetWarehouseTaskConfirmationItem(context);
            const promises = [];
            serialNumberMap.filter(item => item.selected).forEach(element => {
                    promises.push(context.executeAction(
                            {
                                'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 
                                'Properties': {
                                    'Target' : {
                                        'EntitySet' : 'WarehouseTaskConfSerialNumbers',
                                        'Service' : '/SAPAssetManager/Services/AssetManager.service',
                                    },
                                    'Properties' : {
                                        'SerialNumber': element.entry.SerialNumber,
                                        'WarehouseNo': task?.WarehouseNo ?? '#Property:WarehouseNo',
                                        'WarehouseTask': task?.WarehouseTask ?? '#Property:WarehouseTask',
                                        'WarehouseTaskItem': taskConfirmationItem,
                                        'Product' : task?.Product ?? '#Property:Product',
                                        'UII' : '',
                                    },
                                    'Headers': {
                                        'OfflineOData.RemoveAfterUpload': true,
                                        'OfflineOData.TransactionID': task ? `${task.WarehouseTask}${task.WarehouseNo}`:'{{#Property:WarehouseTask}}{{#Property:WarehouseNo}}',        
                                    },
                                    'CreateLinks': '/SAPAssetManager/Rules/EWM/WarehouseTask/Confirmation/SerialNumberCreateLinks.js',
                                    'RequestOptions': {
                                        'UploadCategory': '/SAPAssetManager/Globals/EWM/TaskConfirmationUploadCategory.global',
                                    },
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
                Logger.error('WarehouseTaskConfSerialNumberCreate', error); 
                return Promise.reject(error); 
            });
        }
    }
    return Promise.resolve();
}
