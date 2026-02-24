import libCom from '../../../Common/Library/CommonLibrary';
import { isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
import { EWM_WT_SERIAL_CONF_RECORDS } from './SerialNumberLib';
import libVal from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';

/**
 * Delete all local serial numbers from WharehouseTaskSerialNumber records related to current task item confirmation
 * @param {IClientAPI} context
 */
export default function WarehouseTaskSerialNumberDelete(context) {
    if (isTaskWithSerialNumbers(context)) {
        const warehouseTaskConfSerialNumber =  libCom.getStateVariable(context, EWM_WT_SERIAL_CONF_RECORDS);
        if (libVal.evalIsNotEmpty(warehouseTaskConfSerialNumber)) {
            // changed sap.hasPendingChanges() back to sap.islocal() to avoid deleting records that are not local
            // consider the scenario: sync with server failed, the pending status is gone and those ballast orphan records will stay on the client forever
            // and the user will not be able to delete them
            const baseQuery = `$filter=sap.islocal() and WarehouseTask eq '${context.binding.WarehouseTask}' and WarehouseNo eq '${context.binding.WarehouseNo}'`;
            const snFilter = warehouseTaskConfSerialNumber.map(item => `SerialNumber eq '${item.SerialNumber}'`).join(' or ');
            const query = `${baseQuery} and (${snFilter})`;
            const select = ['SerialNumber', 'WarehouseNo', 'WarehouseTask'];
            const promises = [];
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTaskSerialNumbers', select, query).then((results) => {
                // filter out the local serial numbers for this task item confirmation
                const localEntityToDelete = results.filter(item => warehouseTaskConfSerialNumber.find(r => r.SerialNumber === item.SerialNumber));

                localEntityToDelete.forEach(element => {
                    promises.push(context.executeAction(
                        {
                            'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
                            'Properties': {
                                'Target': {
                                    'EntitySet' : 'WarehouseTaskSerialNumbers',
                                    'Service' : '/SAPAssetManager/Services/AssetManager.service',
                                    'ReadLink' : element['@odata.readLink'],
                                },
                                'RequestOptions': {
                                    'UploadCategory': '/SAPAssetManager/Globals/EWM/TaskConfirmationUploadCategory.global',
                                },
                                'DeleteLinks': [{
                                    'Property': 'WTSerialNumber_Task_Nav',
                                    'Target':
                                    {
                                        'EntitySet': 'WarehouseTasks',
                                        'ReadLink': '{@odata.readLink}',
                                    },
                                }],
            
                            },
                        }),
                    ); 
                });
            }).then(() => { 
                return Promise.all(promises).then(result => { 
                    Logger.debug(result);
                    return Promise.resolve(result);
                });
            }).catch((error) => {
                Logger.error('WarehouseTaskSerialNumberDelete', error);
                return Promise.reject(error); 
            });
        } else {   
            // sanity check - shall never be empty
            Logger.error('warehouseTaskConfSerialNumber', 'warehouseTaskConfirmations collection is empty!');
            // the correct way is to reject the promise
            // but in this case we just log the error and return false
            // this is to avoid breaking the flow in the app because of the local database inconsistency 
            // in case when confirmation for material with SN's somehow made without correcsponding Conf SN's records
            // and to allow the user to continue with the process ignoring this error
            return Promise.resolve(false);
        }
    } 
}
