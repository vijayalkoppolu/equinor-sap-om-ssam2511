import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default function InboundWarehouseTaskConfirmationCreate(context) {
    const binding = context.binding;
    const pageProxy = context.evaluateTargetPathForAPI('#Page:WHTaskCreatePage');
    const confirmvalue = pageProxy?.getControl('FormCellContainer').getControl('ConfirmTaskSwitch')?.getValue();

    if (!confirmvalue) {
        return Promise.resolve();
    }

    const binvalue = pageProxy?.getControl('FormCellContainer')?.getControl('StorageBinPicker')?.getValue()[0]?.ReturnValue ?? '';
    const quantity = pageProxy?.getControl('FormCellContainer')?.getControl('WhQuantitySimple')?.getValue();
    const whtaskreadlink = libCom.getStateVariable(context, 'TaskReadLink');
    const whtaskNumber = libCom.getStateVariable(context, 'LocalId');
    const shortitemnum =  binding?.ItemNumber?.slice(-4);
    const whNum = binding?.WarehouseInboundDelivery_Nav?.WarehouseNum;

    const properties = {
        'Batch': '',
        'WarehouseNo': whNum,
        'DestinationBin': binvalue,
        'ActualQuantity': quantity,
        'WithdrawHU': '',
        'WithdrawHUManual': '',
        'MultiExceptionCodes': '',
        'WarehouseTask': whtaskNumber,
        'SrcHU': '',
        'DestHU': '',
        'WarehouseTaskItem': shortitemnum,
        'WarehouseOrder': whtaskNumber,
    };

    const createAction = {
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WarehouseTaskConfirmations',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties': properties,
            'Headers': {
                'OfflineOData.RemoveAfterUpload': true,
                'OfflineOData.TransactionID': `${whtaskNumber}${whNum}`,
            },
            'CreateLinks': [
                {
                    'Property': 'WarehouseTask_Nav',
                    'Target': {
                        'EntitySet': 'WarehouseTasks',
                        'ReadLink': whtaskreadlink,
                    },
                },
            ],
        },
        'OnFailure': '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action',
        'ShowActivityIndicator': true,
    };

    return context.executeAction(createAction).then(result => {
        return Promise.resolve(result);
    }).catch(error => {
        Logger.error('CreateWarehouseTaskConfrimation', error);
        return Promise.reject(error);
    });
}
