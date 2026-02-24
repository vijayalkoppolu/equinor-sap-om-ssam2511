export default function FLUnsealPackedContainers(clientAPI) {
    const entitySet = 'FldLogsPackCtnPkdCtns';
    const objectId = clientAPI?.evaluateTargetPath?.('#Property:ObjectId');

    let hasPendingChanges = false;
    let isLocal = false;
    let isEditAction = false;
    try {
        hasPendingChanges = clientAPI?.evaluateTargetPath?.('#Property:@sap.hasPendingChanges');
        isLocal = clientAPI?.evaluateTargetPath?.('#Property:@sap.isLocal');
        isEditAction = clientAPI?.evaluateTargetPath?.('#Property:ActionType') === 'EDITALL';
    } catch (e) {
            // Property may not exist; ignore error
    }
    if ((hasPendingChanges || isLocal) && !isEditAction) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainerActionNotAllowed.action');
    }

    const properties = {
        ActionType: 'UNSEAL',
        ObjectId: objectId,
    };

    return clientAPI.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        Properties: {
            Target: {
                EntitySet: entitySet,
                Service: '/SAPAssetManager/Services/AssetManager.service',
                ReadLink: clientAPI.evaluateTargetPath('#Property:@odata.readLink'),
            },
            Properties: properties,
            RequestOptions: {
                UpdateMode: 'Replace',
            },
            Headers: {
                'OfflineOData.TransactionID': objectId,
            },
            TransactionID: objectId,
            OnFailure: '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action',
            OnSuccess: '/SAPAssetManager/Actions/FL/PackContainers/FLPackedContainersUnsealSuccessful.action',
            ShowActivityIndicator: true,
        },
    });
}
