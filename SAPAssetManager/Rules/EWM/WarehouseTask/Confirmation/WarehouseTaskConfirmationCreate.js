import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default function WarehouseTaskConfirmationCreate(clientAPI) {
    const item =  libCom.getStateVariable(clientAPI, 'WarehouseTask');
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationCreate.action',
        'Properties': {
            'Properties': {
                'WarehouseOrder': item?.WarehouseOrder ?? '#Property:WarehouseOrder',
                'WarehouseTask': item?.WarehouseTask ?? '#Property:WarehouseTask',
                'WarehouseNo': item?.WarehouseNo ?? '#Property:WarehouseNo',
                'WarehouseTaskItem': '/SAPAssetManager/Rules/EWM/WarehouseTask/Confirmation/SetWarehouseTaskItemProperty.js',
                'Batch': item?.Batch ?? '#Control:WhBatchSimple/#Value',
                'SrcHU': item?.SourceHU ?? '#Control:WhSourceHUSimple/#Value',
                'DestinationBin': item?.DestinationBin ?? '#Control:WhDestinationBinSimple/#Value',
                'DestHU': item?.DestinationHU ?? '{{#Control:WhDestinationHUPicker/#SelectedValue}}',
                'ActualQuantity': item ? '/SAPAssetManager/Rules/EWM/WarehouseTask/Confirmation/GetQuantityValue.js' : '{{#Control:WhQuantitySimple/#Value}}',
                'WithdrawHU': item ? '':'/SAPAssetManager/Rules/EWM/WarehouseTask/Confirmation/SetRemoveHUProperty.js',
                'WithdrawHUManual': '',
                'MultiExceptionCodes': item?.ExceptionCode ?? '/SAPAssetManager/Rules/EWM/WarehouseTask/Confirmation/SetMultiExceptionCodesProperty.js',
            },
        'CreateLinks': '/SAPAssetManager/Rules/EWM/WarehouseTask/Confirmation/CreateLinks.js',
            'Headers': {
                'OfflineOData.RemoveAfterUpload': true,
                'OfflineOData.TransactionID': item ? `${item.WarehouseTask}${item.WarehouseNo}`:'{{#Property:WarehouseTask}}{{#Property:WarehouseNo}}',
            },
        'ValidationRule': '/SAPAssetManager/Rules/EWM/WarehouseTask/Confirmation/WarehouseTaskConfirmationValidation.js',   
        },
    }).then(result => {
            const TaskConfReadLink = JSON.parse(result.data)['@odata.readLink'];
            libCom.setStateVariable(clientAPI, 'TaskConfirmReadLink', TaskConfReadLink);
            return Promise.resolve(result);
        }).catch(error => {
            Logger.error('CreateWarehouseTask', error);
            return Promise.reject(error);
        });
}
