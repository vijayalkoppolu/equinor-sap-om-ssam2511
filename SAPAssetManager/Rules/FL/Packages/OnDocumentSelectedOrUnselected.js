/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import CommonLibrary from '../../Common/Library/CommonLibrary';
import FLLibrary, {FLDocumentTypeValues, ContainerStatus} from '../Common/FLLibrary';
 
export default function OnDocumentSelectedOrUnselected(context) {
 
    let item = context.getPageProxy().getControls()[0].getSections()[0].getSelectionChangedItem();
    let documents = CommonLibrary.getStateVariable(context, 'PADiscardDocuments') || [];
    let notFoundorReleasedDocuments = CommonLibrary.getStateVariable(context, 'PANotFoundorReleasedDocuments') || [];
    
    updateDocumentObject(item, documents, notFoundorReleasedDocuments, context);
    toolBarFilterMapping(item,context);
}
 
function updateDocumentObject(item, documents, notFoundorReleasedDocuments, context) {
    if (item.selected) {     
        let document = FLLibrary.getDocumentData(item.binding, FLDocumentTypeValues.Package);
        document.ReadLink = item.binding['@odata.readLink'];
        documents.push(document);
        notFoundorReleasedDocuments.push(item.binding);
    } else {
        documents = documents.filter(doc => doc.ReadLink !== item.binding['@odata.readLink']);
        notFoundorReleasedDocuments = notFoundorReleasedDocuments.filter(doc => doc['@odata.readLink'] !== item.binding['@odata.readLink']);
    }
    CommonLibrary.setStateVariable(context, 'PADiscardDocuments', documents);
    CommonLibrary.setStateVariable(context, 'PANotFoundorReleasedDocuments', notFoundorReleasedDocuments);
}

export function setToolBarItems(context, page, receive, notFound,release, discard, receiveType, notFoundType,releaseType, discardType) {
    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', receive, receiveType);
    CommonLibrary.enableToolBar(context, page, 'FLPackageNotFoundItem', notFound, notFoundType);
    CommonLibrary.enableToolBar(context, page, 'FLPackageDiscardItem', discard, discardType);
    CommonLibrary.enableToolBar(context, page, 'FLPackageRelease', release, releaseType);
}
export function toggleToolBar(context, page, isEnabled) {
    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLPackageNotFoundItem', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLPackageRelease', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLPackageDiscardItem', true);
}
 
function toolBarFilterMapping(item, context) {
    const page = CommonLibrary.getPageName(context);
    const discardDocuments = CommonLibrary.getStateVariable(context, 'PADiscardDocuments');
    const enableDiscardButton = discardDocuments?.length > 0 && item.binding.ContainerStatus !== ContainerStatus.Received;
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const itemCount = section.getSelectedItemsCount();
    const notFoundFlag = itemCount >= 1 && (item?.binding?.ContainerStatus === ContainerStatus.Arrived || item?.binding?.ContainerStatus === ContainerStatus.Dispatched);
    const receiveFlag = itemCount >= 1 && (item?.binding?.ContainerStatus === ContainerStatus.Arrived || item?.binding?.ContainerStatus === ContainerStatus.Dispatched || item?.binding?.ContainerStatus === ContainerStatus.PartiallyReceived);
    const releasedFlag = itemCount >= 1 && (item?.binding?.ContainerStatus === ContainerStatus.Arrived || item?.binding?.ContainerStatus === ContainerStatus.Dispatched || item?.binding?.ContainerStatus === ContainerStatus.Received) &&  item.binding.IsContainerReleased !== 'X';
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
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageNotFoundItem', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageRelease', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageDiscardItem', true);
                                } else {
                                    setToolBarItems(context, page, receiveFlag, notFoundFlag, releasedFlag, enableDiscardButton, 'Primary', 'Secondary', 'Text', 'Text');
                                }
                            } else {
                                if (item.binding.ContainerStatus === '20' || item.binding.ContainerStatus === '30') {
                                    if (!(Released)) {
                                        CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', false);
                                        CommonLibrary.enableToolBar(context, page, 'FLPackageNotFoundItem', false);
                                        CommonLibrary.enableToolBar(context, page, 'FLPackageRelease', true);
                                        CommonLibrary.enableToolBar(context, page, 'FLPackageDiscardItem', true);
                                    }
                                } else {
                                    toggleToolBar(context, page, false);
                                }
                            }
                        } else {
                            if (VoyageDispatched) {
                                if (Released) {
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageNotFoundItem', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageRelease', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageDiscardItem', true);
                                } else {
                                    setToolBarItems(context, page, receiveFlag, notFoundFlag, releasedFlag, enableDiscardButton, 'Primary', 'Secondary', 'Text', 'Text');
                                }
                            } else {
                                if (!(Released)) {
                                    CommonLibrary.enableToolBar(context, page, 'FLContainerReceiveinFullItem', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageNotFoundItem', false);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageRelease', true);
                                    CommonLibrary.enableToolBar(context, page, 'FLPackageDiscardItem', true);
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
            setToolBarItems(context, page, receiveFlag, notFoundFlag,releasedFlag, enableDiscardButton, 'Primary', 'Secondary', 'Text', 'Text');
        }
    } else { // No line item selected
        setToolBarItems(context, page, false, false, false, false, 'Text', 'Text', 'Text', 'Text');
    }
    return true;
}
 
