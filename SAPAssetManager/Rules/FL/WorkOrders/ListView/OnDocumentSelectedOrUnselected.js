/**
* Handles selection and unselection of Work Order documents in the list view.
* @param {IClientAPI} context
*/
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import FLLibrary, {FLDocumentTypeValues} from '../../Common/FLLibrary';

export default function OnDocumentSelectedOrUnselected(context) {
    const page = CommonLibrary.getPageName(context);

    let item = context.getPageProxy().getControls()[0].getSections()[0].getSelectionChangedItem();
    let documents = CommonLibrary.getStateVariable(context, 'FLWorkOrderDiscardDocuments') || [];
    updateDocumentObject(item, documents, context);

    const discardDocuments = CommonLibrary.getStateVariable(context, 'FLWorkOrderDiscardDocuments');
    const enableDiscardButton = discardDocuments?.length > 0;
    
    return CommonLibrary.enableToolBar(context, page, 'FLWorkOrderDiscardItem', enableDiscardButton);
}

function updateDocumentObject(item, documents, context) {
    if (item.selected) {     
        let document = FLLibrary.getDocumentData(item.binding, FLDocumentTypeValues.WorkNetworkOrder);
        document.ReadLink = item.binding['@odata.readLink'];
        documents.push(document);
    } else {
        documents = documents.filter(doc => doc.ReadLink !== item.binding['@odata.readLink']);
    }
    CommonLibrary.setStateVariable(context, 'FLWorkOrderDiscardDocuments', documents);
}
