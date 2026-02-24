import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';
export default function PurchaseOrderOnDemandObjectDelete(context) {

    let objectID = context.binding.TempLine_PurchaseOrderNumber;
    let objectType;
    let action = 'D';

    let parent = libCom.getStateVariable(context, 'IMObjectType');
    if (parent === 'PO') {
        objectType = 'PO';
    } else if (parent === 'STO') {
        objectType = 'ST';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], "$filter=ObjectId eq '" + objectID + "' and ObjectType eq '" + objectType + "' and Action eq '" + action + "'").then(function(results) {
        if (results && results.length > 0) {
            let row = results.getItem(0);
            if (ODataLibrary.hasAnyPendingChanges(row)) {
                return true; //Nothing to do, record is already in the transaction queue
            }
            let readLink = row['@odata.readLink'];
            //Row exists, but is not in transaction queue, so update it
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Inventory/CreateUpdateDelete/OnDemandObjectUpdateGeneric.action', 'Properties': {
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                    },
                    'Properties': {
                    'ObjectId': objectID,
                    'ObjectType': objectType,
                    'Action': action,
                },
                'Target': {
                    'ReadLink' : readLink,
                },                
            }});
        }
        //Row does not exist, so create one
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/CreateUpdateDelete/OnDemandObjectCreateGeneric.action', 'Properties': {
            'Headers': {
                'OfflineOData.RemoveAfterUpload': true,
            },
            'Properties': {
                'ObjectId': objectID,
                'ObjectType': objectType,
                'Action': action,
            },           
        }});
    });
}
