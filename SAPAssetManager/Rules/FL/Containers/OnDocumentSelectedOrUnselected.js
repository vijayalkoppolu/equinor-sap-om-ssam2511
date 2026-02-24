/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import CommonLibrary from '../../Common/Library/CommonLibrary';
import FLLibrary, {FLDocumentTypeValues} from '../Common/FLLibrary';
import { ContainerStatus } from '../Common/FLLibrary';

export default function OnDocumentSelectedOrUnselected(context) {
    let item = context.getPageProxy().getControls()[0].getSections()[0].getSelectionChangedItem();
    let documents = CommonLibrary.getStateVariable(context, 'CODiscardDocuments') || [];
    const page = CommonLibrary.getPageName(context);
    let notFoundorReleasedDocuments = CommonLibrary.getStateVariable(context, 'CONotFoundorReleasedDocuments') || [];
    updateDocumentObject(item, documents, notFoundorReleasedDocuments, context);
    const discardDocuments = CommonLibrary.getStateVariable(context, 'CODiscardDocuments');
    toolBarFilterMapping(item,context,page,discardDocuments);
}

function updateDocumentObject(item, documents, notFoundorReleasedDocuments, context) {
    if (item.selected) {     
        let document = FLLibrary.getDocumentData(item.binding, FLDocumentTypeValues.Container);
        document.ReadLink = item.binding['@odata.readLink'];
        documents.push(document);
        notFoundorReleasedDocuments.push(item.binding);
    } else {
        documents = documents.filter(doc => doc.ReadLink !== item.binding['@odata.readLink']);
        notFoundorReleasedDocuments = notFoundorReleasedDocuments.filter(doc => doc['@odata.readLink'] !== item.binding['@odata.readLink']);
    }
    CommonLibrary.setStateVariable(context, 'CODiscardDocuments', documents);
    CommonLibrary.setStateVariable(context, 'CONotFoundorReleasedDocuments', notFoundorReleasedDocuments);
}


export function setToolBarItems(context, page, receive, notFound, release, discard, receiveType, notFoundType, releaseType, discardType) {
    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', receive, receiveType);
    CommonLibrary.enableToolBar(context, page, 'FLContainerNotFoundItem', notFound, notFoundType);
    CommonLibrary.enableToolBar(context, page, 'FLContainerRelease', release, releaseType);
    CommonLibrary.enableToolBar(context, page, 'FLContainerDiscardItem', discard, discardType);
}

export function toggleToolBar(context, page, isEnabled) {
    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLContainerNotFoundItem', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLContainerRelease', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLContainerDiscardItem', true);
}

export function toolBarFilterMapping(item, context, page, discardDocuments) {
    const enableDiscardButton = discardDocuments?.length > 0 && item.binding.ContainerStatus !== ContainerStatus.Received;
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const itemCount = section.getSelectedItemsCount();
    const notFoundFlag = itemCount >= 1 && (item?.binding?.ContainerStatus === ContainerStatus.Arrived || item?.binding?.ContainerStatus === ContainerStatus.Dispatched);
    const releasedFlag = itemCount >= 1 && (item?.binding?.ContainerStatus === ContainerStatus.Arrived || item?.binding?.ContainerStatus === ContainerStatus.Dispatched || item?.binding?.ContainerStatus === ContainerStatus.Received) &&  item.binding.IsContainerReleased !== 'X';
    const receiveFlag = itemCount >= 1 && (item?.binding?.ContainerStatus === ContainerStatus.Arrived || item?.binding?.ContainerStatus === ContainerStatus.Dispatched || item?.binding?.ContainerStatus === ContainerStatus.PartiallyReceived);
    const VoyageArrived = item?.binding?.ContainerStatus === ContainerStatus.Arrived;
    const VoyageDispatched =  item?.binding?.ContainerStatus === ContainerStatus.Dispatched;
    const VoyageUUID =  item.binding.VoyageUUID && (item.binding.VoyageUUID.length > 0);
    const Released = item.binding.IsContainerReleased === 'X';

    if (discardDocuments?.length > 0) {
        if (context.filters) {
            const filterLength = context?.filters[0].filterItemsDisplayValue.length;
            const filterLabel = context?.filters[0].filterItemsDisplayValue[0].match(/^[^\(]+/)[0].trim();

            if (filterLength === 1) { // either Open or Received
                switch (filterLabel) {
                    case context.localizeText('open_container_list'):
                        if (VoyageUUID) {
                            if (VoyageArrived) {
                                if (Released) {
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerNotFoundItem', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerRelease', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerDiscardItem', true);
                                } else {
                                    setToolBarItems(context, page, receiveFlag, notFoundFlag, releasedFlag, enableDiscardButton, 'Primary', 'Secondary', 'Text', 'Text');
                                }
                            } else {
                                if (item.binding.ContainerStatus === '20' || item.binding.ContainerStatus === '30') {
                                    if (!(Released)) {
                                        CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', false);
                                        CommonLibrary.enableToolBar(context, page, 'FLContainerNotFoundItem', false);
                                        CommonLibrary.enableToolBar(context, page, 'FLContainerRelease', true);
                                        CommonLibrary.enableToolBar(context, page, 'FLContainerDiscardItem', true);
                                    }
                                } else {
                                    toggleToolBar(context, page, false);
                                }
                            }
                        } else {
                            if (VoyageDispatched) {
                                if (Released) {
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerNotFoundItem', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerRelease', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerDiscardItem', true);
                                } else {
                                    setToolBarItems(context, page, receiveFlag, notFoundFlag, releasedFlag, enableDiscardButton, 'Primary', 'Secondary', 'Text', 'Text');
                                }
                            } else {
                                if (!(Released)) {
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerNotFoundItem', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerRelease', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerDiscardItem', true);
                                } else {
                                    toggleToolBar(context, page, false);
                                }
                            }
                        }
                        break;
                    case context.localizeText('received_container_list'):
                        setToolBarItems(context, page, false, false, releasedFlag, false, 'Text', 'Text', 'Primary', 'Text');
                        break;
                    case context.localizeText('not_found_container_list'):
                        setToolBarItems(context, page, false, false, false, true, 'Text', 'Text', 'Text', 'Primary');
                        break;
                }
            }
        } else { // No fast filter selection
            setToolBarItems(context, page, receiveFlag, notFoundFlag, releasedFlag, enableDiscardButton, 'Primary', 'Secondary', 'Text', 'Text');
        }
    } else { // No line item selected
        setToolBarItems(context, page, false, false, false, false, 'Text', 'Text', 'Text', 'Text');
    }
    return true;
}
