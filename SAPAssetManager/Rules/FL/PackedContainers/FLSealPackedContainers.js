import FLPackedContainersSealProperties from './FLPackedContainersSealProperties';

export default function FLSealPackedContainers(clientAPI) {
    const binding = clientAPI.getBindingObject();
    const entitySet = 'FldLogsPackCtnPkdCtns';
    const objectId = binding.ObjectId;

    let hasPendingChanges = false;
    let isLocal = false;
    let isEditAction = false;
    try {
        hasPendingChanges = (binding && binding['@sap.hasPendingChanges']) || clientAPI?.evaluateTargetPath?.('#Property:@sap.hasPendingChanges');
        isLocal = (binding && binding['@sap.isLocal']) || clientAPI?.evaluateTargetPath?.('#Property:@sap.isLocal');
        isEditAction = (binding && binding.ActionType === 'EDITALL') || clientAPI?.evaluateTargetPath?.('#Property:ActionType') === 'EDITALL';
    } catch (e) {
            // Property may not exist; ignore error
    }

    if ((hasPendingChanges || isLocal) && !isEditAction) {
    return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainerActionNotAllowed.action');
    }

    const properties = FLPackedContainersSealProperties(clientAPI);
    return clientAPI.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        Properties: {
            Target: {
                EntitySet: entitySet,
                Service: '/SAPAssetManager/Services/AssetManager.service',
                ReadLink: binding['@odata.readLink'],
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
            OnSuccess: '/SAPAssetManager/Actions/FL/PackContainers/FLPackedContainersSealSuccessful.action',
            ShowActivityIndicator: true,
        },
    }).then(() => {
            clientAPI.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
    });
}
