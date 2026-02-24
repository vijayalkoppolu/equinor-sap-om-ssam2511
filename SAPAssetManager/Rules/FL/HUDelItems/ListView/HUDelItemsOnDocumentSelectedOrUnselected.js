/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import FLLibrary, {FLDocumentTypeValues} from '../../Common/FLLibrary';
import { voyageStatusCode } from '../../ContainerItems/ContainerItemsListQueryOptions'; 

export default async function HUDelItemsOnDocumentSelectedOrUnselected(context) {
    const page = CommonLibrary.getPageName(context);
    const voyageStatus = await voyageStatusCode(context);

    let item = context.getPageProxy().getControls()[0].getSections()[0].getSelectionChangedItem();
    let documents = CommonLibrary.getStateVariable(context, 'HUDelDiscardDocuments') || [];
    let notFound = CommonLibrary.getStateVariable(context, 'HUDelNotFoundDocuments') || [];
 
    updateDocumentObject(item, documents, notFound, context);

    if (item.selected && documents.length >= 1) {
        if (item.binding.VoyageUUID && item.binding.VoyageUUID.length > 0 ) {
            if (item.binding.ContainerItemStatus === '20') {
                toggleToolBar(context, page, (!voyageStatus || voyageStatus === '02'));
            } else if (item.binding.ContainerItemStatus === '35') {
                CommonLibrary.enableToolBar(context, page, 'ReceiveItem', (!voyageStatus || voyageStatus === '02'));
                CommonLibrary.enableToolBar(context, page, 'FLHUDelItemDiscardItem', true);
                CommonLibrary.enableToolBar(context, page, 'FLHUDelItemNotFoundItem', false);
            } else {
                toggleToolBar(context, page, false);
            }
            } else {
            if (item.binding.ContainerItemStatus === '10') {
                CommonLibrary.enableToolBar(context, page, 'ReceiveItem', (!voyageStatus || voyageStatus === '02'));
                CommonLibrary.enableToolBar(context, page, 'FLHUDelItemDiscardItem', true);
                CommonLibrary.enableToolBar(context, page, 'FLHUDelItemNotFoundItem', false);
            } else if (item.binding.ContainerItemStatus === '35') {
                CommonLibrary.enableToolBar(context, page, 'ReceiveItem', (!voyageStatus || voyageStatus === '02'));
                CommonLibrary.enableToolBar(context, page, 'FLHUDelItemDiscardItem', true);
                CommonLibrary.enableToolBar(context, page, 'FLHUDelItemNotFoundItem', false);
            } else {
                toggleToolBar(context, page, false);
            }
            }
    } else {
        const document = CommonLibrary.getStateVariable(context, 'HUDelDiscardDocuments');
        if (document.length === 0) {
            toggleToolBar(context, page, false);
        }
    }

}

function toggleToolBar(context, page, isEnabled) {
    CommonLibrary.enableToolBar(context, page, 'ReceiveItem', isEnabled);
    CommonLibrary.enableToolBar(context, page, 'FLHUDelItemDiscardItem', true);
    CommonLibrary.enableToolBar(context, page, 'FLHUDelItemNotFoundItem', isEnabled);
}
 
function updateDocumentObject(item, documents, notFound, context) {
    if (item.selected) {     
        let document = FLLibrary.getDocumentData(item.binding, FLDocumentTypeValues.HandlingUnitDeliveryItem);
        document.ReadLink = item.binding['@odata.readLink'];
        documents.push(document);
        notFound.push(item.binding);
    } else {
        documents = documents.filter(doc => doc.ReadLink !== item.binding['@odata.readLink']);
        notFound = notFound.filter(doc => doc['@odata.readLink'] !== item.binding['@odata.readLink']);
    }
    CommonLibrary.setStateVariable(context, 'HUDelDiscardDocuments', documents);
    CommonLibrary.setStateVariable(context, 'HUDelNotFoundDocuments', notFound);
}
