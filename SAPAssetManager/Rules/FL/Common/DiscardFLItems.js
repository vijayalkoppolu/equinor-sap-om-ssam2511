import libVal from '../../Common/Library/ValidationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import ODataLibrary from '../../OData/ODataLibrary';

export default function DiscardFLItems(context) {
    let currentPage = context.currentPage.id;
    let stateVariables;

    switch (currentPage) {
        case 'ContainersListPage':
            stateVariables = {
                pagePath: '#Page:ContainersListPage',
                stateVariable: 'CODiscardDocuments',
                discardButton: 'FLContainerDiscardItem',
            };
            break;
        case 'PackagesListPage':
            stateVariables = {
                pagePath: '#Page:PackagesListPage',
                stateVariable: 'PADiscardDocuments',
                discardButton: 'FLPackageDiscardItem',
            };
            break;
        case 'VoyagesListPage':
            stateVariables = {
                pagePath: '#Page:VoyagesListPage',
                stateVariable: 'VODiscardDocuments',
                discardButton: 'FLVoyageDiscardItem',
            };
            break;
        case 'FLWorkOrdersListViewPage':
             stateVariables = { 
                pagePath: '#Page:FLWorkOrdersListViewPage',
                stateVariable: 'FLWorkOrderDiscardDocuments',
                discardButton: 'FLWorkOrderDiscardItem',
            };
            break;
        case 'HUDelItemsListPage':
            stateVariables = { 
                pagePath: '#Page:HUDelItemsListPage',
                stateVariable: 'HUDelDiscardDocuments',
                discardButton: 'FLHUDelItemDiscardItem',
            };
            break;
        default:
            throw new Error('Invalid page');
    }

    CommonLibrary.setStateVariable(context, 'discardState', stateVariables);

    return context.executeAction('/SAPAssetManager/Actions/FL/Containers/FLDiscardWarningMessage.action').then(successResult => {
        if (successResult.data) {
            const discardState = CommonLibrary.getStateVariable(context, 'discardState');
            context.evaluateTargetPathForAPI(discardState.pagePath).getControls()[0].getSections()[0].setSelectionMode('None');
            parentObjectDiscard(context, discardState, currentPage, '', CommonLibrary.getStateVariable(context, discardState.stateVariable));
        }
    });
}

function parentObjectDiscard(context, discardState, currentPage, index, cachedDocs) {
    let documents = cachedDocs || CommonLibrary.getStateVariable(context, discardState.stateVariable);
    let idx = libVal.evalIsEmpty(index) ? 0 : index;

    if (documents && documents.length > idx) {
        let id = documents[idx].ObjectId;
        return OnDemandObjectDelete(context, id, documents[idx].FLObject).then(() => {
            idx = idx + 1;
            return parentObjectDiscard(context, discardState, currentPage, idx, documents); 
        }).catch((error) => {
            Logger.error(discardState.stateVariable, error);
            idx = idx + 1;
            return parentObjectDiscard(context, discardState, currentPage, idx, documents); 
        });
    }

    CommonLibrary.enableToolBar(context, currentPage, discardState.discardButton, 'false');
    context.evaluateTargetPathForAPI(discardState.pagePath).getControls()[0].redraw();
    context.evaluateTargetPathForAPI('#Page:FLOverviewPage').getControls()[0].redraw();
    //clear the state variable object
    CommonLibrary.setStateVariable(context, 'discardState', {
        pagePath: '',
        stateVariable: [],
        discardButton: '',
    });

    return true;
}

function OnDemandObjectDelete(context, objectID, objectType) {
    const action = 'D';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], `$filter=ObjectId eq '${objectID}' and ObjectType eq '${objectType}' and Action eq '${action}'`).then(function(results) {
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
                        'ReadLink': readLink,
                    },
                },
            });
        }
        //Row does not exist, so create one
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Inventory/CreateUpdateDelete/OnDemandObjectCreateGeneric.action', 'Properties': {
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': true,
                },
                'Properties': {
                    'ObjectId': objectID,
                    'ObjectType': objectType,
                    'Action': action,
                },
            },
        });
    });
}
