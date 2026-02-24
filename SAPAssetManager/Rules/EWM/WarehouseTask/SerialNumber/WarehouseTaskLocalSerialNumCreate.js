import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default function WarehouseTaskLocalSerialNumCreate(context) {
    const binding = context.binding;
    if (binding?.Serialized) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/SerialNumber_Nav`, [], '').then(result => {
            if (result && result.length > 0) {
                let createActions = [];

                result.forEach(serial => {
                    const serialNumber = serial.SerialNumber;
                    const whtaskNumber = libCom.getStateVariable(context, 'LocalId');
                    const whtaskreadlink = libCom.getStateVariable(context, 'TaskReadLink');
                    const whNum = binding.WarehouseInboundDelivery_Nav?.WarehouseNum;

                    createActions.push(
                        context.executeAction({
                            'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
                            'Properties': {
                                'Target': {
                                    'EntitySet': 'WarehouseTaskSerialNumbers',
                                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                                },
                                'Properties': {
                                    'SerialNumber': serialNumber,
                                    'WarehouseTask': whtaskNumber,
                                    'WarehouseNo': whNum,
                                    'FromDelivery': 'X',
                                },
                                'Headers': {
                                    'OfflineOData.RemoveAfterUpload': true,
                                    'OfflineOData.TransactionID': `${whtaskNumber}${whNum}`,
                                },
                                
                                'CreateLinks': [
                                    {
                                        'Property': 'WTSerialNumber_Task_Nav',
                                        'Target': {
                                            'EntitySet': 'WarehouseTasks',
                                            'ReadLink': whtaskreadlink,
                                        },
                                    },
                                ],
                            },
                        }),
                    );
                });

                return Promise.all(createActions);
            }
            return Promise.resolve();
        }).catch(error => {
            Logger.error('WarehouseTaskSerialNumberCreate', error);
            return Promise.reject(error);
        });
    }
    return Promise.resolve();
}
