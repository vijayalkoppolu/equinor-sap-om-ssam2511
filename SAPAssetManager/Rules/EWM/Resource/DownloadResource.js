import libCom from '../../Common/Library/CommonLibrary';
import ApplicationOnSync from '../../ApplicationEvents/ApplicationOnSync';
export default function DownloadResource(context) {

    return Promise.all([
        context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', [], ''),
        context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], ''),
        context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehousePhysicalInventoryItems', [], ''),
        context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveries', [], ''),
    ])
        .then(([orders, tasks, items]) => Array.from(orders.concat(Array.from(tasks), Array.from(items))))
        .then(documents => DownloadDoc(context, documents))
        .finally(() => FetchDocuments(context));
}

function DownloadDoc(context, documents) {

    return documents.reduce((prevCreatePromise, currentItem) => {
        return prevCreatePromise.then(() => {
            let type = currentItem['@odata.type'].substring('#sap_mobile.'.length);
            let objectId = '';
            let objectType = '';
            if (type === 'WarehouseOrder') {
                objectId = `${currentItem.WarehouseNo}${currentItem.WarehouseOrder}`;
                objectType = 'WHO';
            } else if (type === 'WarehouseTask') {
                objectId = `${currentItem.WarehouseNo}${currentItem.WarehouseTask}`;
                objectType = 'WHT';
            } else if (type === 'WarehousePhysicalInventoryItem') {
                objectId = `${currentItem.GUID}${currentItem.ITEM_NO}`;
                objectType = 'WHPI';
            } else if (type === 'WarehouseInboundDelivery') {
                objectId = `${currentItem.DocumentID}`;
                objectType = 'WHIB';
            }
            libCom.setStateVariable(context, 'ObjectId', objectId);
            libCom.setStateVariable(context, 'ObjectType', objectType);
            libCom.setStateVariable(context, 'Action', 'D');
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action', 'Properties': {
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                    },
                },
            });
        });
    }, Promise.resolve());
}

function FetchDocuments(context) {
    ApplicationOnSync(context);
    return context.executeAction('/SAPAssetManager/Actions/EWM/OverviewPage/OverviewPageNav.action');
}
