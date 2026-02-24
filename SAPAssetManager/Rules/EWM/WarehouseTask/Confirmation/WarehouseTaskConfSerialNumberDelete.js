import libCom from '../../../Common/Library/CommonLibrary';
import { isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
import { EWM_WT_SERIAL_CONF_RECORDS } from '../SerialNumber/SerialNumberLib';
import libVal from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';

/**
 * Delete records of serial numbers
 * @param {IClientAPI} context
 */
export default function WarehouseTaskConfSerialNumberDelete(context) {
    if (isTaskWithSerialNumbers(context)) {
        const warehouseTaskSerialConfNumberRecords =  libCom.getStateVariable(context, EWM_WT_SERIAL_CONF_RECORDS);
        if (libVal.evalIsNotEmpty(warehouseTaskSerialConfNumberRecords)) {
            const promises = [];
            warehouseTaskSerialConfNumberRecords.forEach(element => {
                promises.push(context.executeAction(
                    {
                        'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 
                        'Properties': {
                            'Target': {
                                'EntitySet' : 'WarehouseTaskConfSerialNumbers',
                                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink' : element['@odata.readLink'],
                            },
                            'RequestOptions': {
                                'UploadCategory': '/SAPAssetManager/Globals/EWM/TaskConfirmationUploadCategory.global',
                            },
                        },
                    }));
            });

            return Promise.all(promises).then(result => { 
                Logger.debug(result);
                return Promise.resolve(result);
            }).catch(error => { 
                Logger.error('WarehouseTaskConfSerialNumberDelete', error);
                return Promise.reject(error); 
            });
        }
    }
    return Promise.resolve();
}
