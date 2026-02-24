import { getUpdatedItemsFromEDT } from './BulkFLSave';
/**
* This function is called to update each FL item in the Bulk Edit page for FL.
* @param {IClientAPI} clientAPI
*/
export default function BulkFLUpdate(context) {
    const items = getUpdatedItemsFromEDT(context);
    const itemsUpdated = items.filter((item) => (item));
    return UpdateFLItemInLoop(context, itemsUpdated);
}
export function UpdateFLItemInLoop(context, items) {
    return items.reduce((prevUpdatePromise, item) => {
        return prevUpdatePromise.then(() => {
            item.OdataBinding.ActionType = 'EDITALL';
            // Values from EDT
            item.OdataBinding.FldLogsCtnActualWeight = item.Properties.ActualWeight;
            item.OdataBinding.FldLogsCtnActualWeightUnit = item.Properties.UOM;
            item.OdataBinding.FldLogsShptLocationID = item.Properties.LocationId;
            return FLDocumentUpdate(context, item.OdataBinding);     
        });
    }, Promise.resolve());
}

function FLDocumentUpdate(context, item) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/FL/PackContainers/FLPackContainerUpdate.action',
        'Properties': {
            'Target': {
                'ReadLink': item['@odata.readLink'],
            },
            'Properties': {
                'FldLogsCtnActualWeight': item.FldLogsCtnActualWeight,
                'FldLogsCtnActualWeightUnit': item.FldLogsCtnActualWeightUnit,
                'FldLogsShptLocationID': item.FldLogsShptLocationID,
                'FldLogsContainerUnitExternalID': item.FldLogsContainerUnitExternalID,
            },
            'Headers': {
                'OfflineOData.TransactionID': item.ObjectId,
            },
            'OnSuccess': '',
        },
    });
}

