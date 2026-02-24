import libCom from '../../../Rules/Common/Library/CommonLibrary';
import libVal from '../../../Rules/Common/Library/ValidationLibrary';
import ApplicationOnSync from '../../../Rules/ApplicationEvents/ApplicationOnSync';
import GetResource from '../Resource/GetResource';

export default async function ReleaseWHOrderFromResource(context) {
    GetResource(context).then((resource) => {
        if (libVal.evalIsNotEmpty(resource)) {
            unassignWHO(context, resource);
        }
    });
}

function unassignWHO(context, resource, binding = context.binding) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderRelease.action', 'Properties': {
            'Properties': {
                'AssignRSRC': '',
                'UnassignRSRC': 'X',
                'Resource': resource,
                'CreationTime': '',
                'CreationDateTimeWH': '',
            },
            'Target': {
                'EntitySet': 'WarehouseOrders',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': '{@odata.readLink}',
                'QueryOptions': `$filter=WarehouseNo eq '${binding.WarehouseNo}' and WarehouseOrder eq '${binding.WarehouseOrder}'`,
            },
        },
    }).then(() => {
        return deleteWHData(context).then(() => {
            ApplicationOnSync(context);
            return context.executeAction('/SAPAssetManager/Actions/EWM/OverviewPage/OverviewPageNav.action');
        });
    });
}

function deleteWHData(context, binding = context.binding) {
    const service = '/SAPAssetManager/Services/AssetManager.service';
    const filter = `$filter=WarehouseNo eq '${binding.WarehouseNo}' and WarehouseOrder eq '${binding.WarehouseOrder}'`;
    return Promise.all([
        context.read(service, 'WarehousePhysicalInventories', [], filter).then((items) => {
            Promise.all(
                Array.from(items).map((currentItem) => {
                    deleteDocument(context, `${currentItem.GUID}`, 'WHPI');
                }),
            );
        }),
        context.read(service, 'WarehouseTasks', [], filter).then((tasks) => {
            Promise.all(
                Array.from(tasks).map((currentTask) => {
                    deleteDocument(context, `${currentTask.WarehouseNo}${currentTask.WarehouseTask}`, 'WHT');
                }),
            );
        }),
        context.read(service, 'WarehouseOrders', [], filter).then((orders) => {
            Promise.all(
                Array.from(orders).map((currentOrder) => {
                    deleteDocument(context, `${currentOrder.WarehouseNo}${currentOrder.WarehouseOrder}`, 'WHO');
                }),
            );
        }),
    ]);
}

function deleteDocument(context, objectId, objectType) {
    libCom.setStateVariable(context, 'ObjectId', objectId);
    libCom.setStateVariable(context, 'ObjectType', objectType);
    libCom.setStateVariable(context, 'Action', 'D');
    return context.executeAction({'Name':'/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action', 'Properties': {
        'Headers': {
            'OfflineOData.RemoveAfterUpload': true,
        },
    }});
}
