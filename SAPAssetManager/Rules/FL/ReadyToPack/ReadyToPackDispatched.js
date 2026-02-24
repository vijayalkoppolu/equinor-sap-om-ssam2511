import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ReadyToPackDispatched(clientAPI) {
    const page = CommonLibrary.getPageName(clientAPI);

    const pageConfig = {
        ReadyToPackItemsListView: {
            docVar: 'RPDispatchedDocuments',
            entitySet: 'FldLogsPackCtnRdyPcks',
            pageName: 'ReadyToPackItemsListView',
            toolbar: 'FLReadyToPackDispatchedItem',
        },
        PackedPackagesListViewPage: {
            docVar: 'PPDispatchedDocuments',
            entitySet: 'FldLogsPackCtnPkdPkgs',
            pageName: 'PackedPackagesListViewPage',
            toolbar: 'FLPackedPackagesDispatchedItem',
        },
        PackedContainersListViewPage: {
            docVar: 'PCDispatchedDocuments',
            entitySet: 'FldLogsPackCtnPkdCtns',
            pageName: 'PackedContainersListViewPage',
            toolbar: 'FLPackedContainersDispatchedItem',
        },
    };

    const config = pageConfig[page] || {};
    let packContainerItems = CommonLibrary.getStateVariable(clientAPI, config.docVar) || [];
    let entitySet = config.entitySet || '';
    let listViewPageName = config.pageName || '';

    if (packContainerItems.length === 0) {
        return Promise.resolve(false);
    }

    if (entitySet === 'FldLogsPackCtnPkdCtns') {
        const hasLocalOrPending = packContainerItems.some(item => {
            try {
                return (item.ActionType !== 'EDITALL') && (item.sapIsLocal || item.hasPendingChanges);
            } catch (e) {
                // Property may not exist; ignore error
                return false;
            }
        });
        if (hasLocalOrPending) {
            return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainerActionNotAllowed.action');
        }
    }

    let dispatchedInProgress = CommonLibrary.getStateVariable(clientAPI, 'RPDispatchedDocumentsInProgress') || [];

    const updatePromises = packContainerItems.map(item => {
        // If already dispatched, show message and skip
        if (dispatchedInProgress.some(doc => doc.ObjectId === item.ObjectId)) {
            clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainerDispatchManualSync.action');
            return Promise.resolve(false);
        }
        item.ActionType = 'DISPATCH';
        const properties = {
            ObjectId: item.ObjectId,
            ActionType: item.ActionType,
        };
        return executeUpdateAction(clientAPI, properties, entitySet, item);
    });

    return Promise.all(updatePromises)
        .then(() => {
            // Merge previously dispatched with newly dispatched, avoiding duplicates
            const newlyDispatched = packContainerItems.filter(item =>
                !dispatchedInProgress.some(doc => doc.ObjectId === item.ObjectId),
            );
            const allDispatched = [...dispatchedInProgress, ...newlyDispatched].filter(
                (item, index, self) => self.findIndex(i => i.ObjectId === item.ObjectId) === index,
            );
            CommonLibrary.setStateVariable(clientAPI, 'RPDispatchedDocumentsInProgress', allDispatched);
            clientAPI.evaluateTargetPathForAPI('#Page:' + listViewPageName).getControls()[0].redraw();
            CommonLibrary.enableToolBar(clientAPI, page, config.toolbar, false);
            clientAPI.getPageProxy().getFioriToolbar().redraw();
            const sectionedTable = clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControl('SectionedTable');
            if (sectionedTable && sectionedTable.getSections().length > 0) {
                sectionedTable.getSections()[0].setSelectionMode('None');
            }
        })
        .catch((error) => {
            throw error;
        });
}

function executeUpdateAction(clientAPI, properties, entitySet, binding) {
    return clientAPI.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        Properties: {
            Target: {
                EntitySet: entitySet,
                Service: '/SAPAssetManager/Services/AssetManager.service',
                ReadLink: binding.ReadLink,
            },
            Properties: properties,
            RequestOptions: {
                UpdateMode: 'Replace',
            },
            ActionResult: {
                _Name: 'result',
            },
            OnSuccess: '/SAPAssetManager/Actions/FL/PackContainers/FLPackContainerDispatchedMessage.action',
            ShowActivityIndicator: true,
            Headers: {
                'OfflineOData.TransactionID': binding.ObjectId,
            },
            TransactionID: binding.ObjectId,
        },
    });
}
