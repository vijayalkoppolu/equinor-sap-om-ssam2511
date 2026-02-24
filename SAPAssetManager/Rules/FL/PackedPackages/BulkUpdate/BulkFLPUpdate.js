import { getUpdatedItemsFromEDT } from './BulkFLPSave';

export default function BulkFLPUpdate(context) {
    const items = getUpdatedItemsFromEDT(context);
    const itemsUpdated = items.filter((item) => item.Properties.ItemSelection);
    return UpdateFLItemInLoop(context, itemsUpdated);
}
export function UpdateFLItemInLoop(context, items) {
    return items.reduce((prevUpdatePromise, item) => {
        return prevUpdatePromise.then(() => {
             return editAll(context, item.Properties, item.OdataBinding);
        });
    }, Promise.resolve());
}

function editAll(clientAPI, properties, binding) {
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/FL/PackedPackages/FLPackedPackageUpdate.action',
        'Properties': {
            'Target': {
                'ReadLink': binding['@odata.readLink'],
            },
            'Properties': {
                'ActionType': 'EDITALL',
                'FldLogsVoyageSrceStage': binding.FldLogsVoyageSrceStage,
                'FldLogsVoyageDestStage': properties.FldLogsVoyageDestStage,
                'FldLogsCtnActualWeight': properties.FldLogsCtnActualWeight,
                'FldLogsCtnActualWeightUnit': properties.FldLogsCtnActualWeightUnit,
                'FldLogsShptLocationID': binding.FldLogsShptLocationID,
                'FldLogsContainerUnitExternalID': binding.FldLogsContainerUnitExternalID,
            },
            'ActionResult': {
                '_Name': 'result',
            },
            'OnSuccess': '',
            'OnFailure': '/SAPAssetManager/Actions/FL/Edit/SwitchResourceFailure.action',
            'ValidationRule': '',
            'Headers': {
                'OfflineOData.TransactionID': `${binding.ObjectId}`,
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
                'UnmodifiableRequest': true,
            },
        },
    });
}
