import CommonLibrary from '../../Common/Library/CommonLibrary';
import FLLibrary, { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function OnDocumentSelectedOrUnselected(context) {
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding);

    const page = CommonLibrary.getPageName(context);
    // Only keep documents with status in packing and transportation status not started
    const goodsIssueDocuments = selectedItems
        .filter(item => item.FldLogsCtnPackgStsCode === '20' && (item.FldLogsCtnIntTranspStsCode === '25' || item.FldLogsCtnIntTranspStsCode === '10'))
        .map(item => {
            let document = FLLibrary.getDocumentData(item, FLDocumentTypeValues.PackedContainers);
            document.ReadLink = item['@odata.readLink'];
            document.ObjectId = item.ObjectId;
            document.sapIsLocal = item['@sap.isLocal'];
            document.hasPendingChanges = item['@sap.hasPendingChanges'];
            document.ActionType = item.ActionType;
            return document;
        });
    CommonLibrary.setStateVariable(context, 'PCGoodsIssueDocuments', goodsIssueDocuments);

    // Add documents with transportation status ready for dispatch
    const dispatchedDocuments = selectedItems
        .filter(item => item.FldLogsCtnPackgStsCode === '20' && item.FldLogsCtnIntTranspStsCode === '17')
        .map(item => {
            let document = FLLibrary.getDocumentData(item, FLDocumentTypeValues.PackedContainers);
            document.ReadLink = item['@odata.readLink'];
            document.ObjectId = item.ObjectId;
            document.sapIsLocal = item['@sap.isLocal'];
            document.hasPendingChanges = item['@sap.hasPendingChanges'];
            document.ActionType = item.ActionType;
            return document;
        });
    CommonLibrary.setStateVariable(context, 'PCDispatchedDocuments', dispatchedDocuments);

    // Enable button only if all selected items have status code "20" and at least one is selected
    const enableGoodsIssueButton = selectedItems.length === 1 && selectedItems.every(item => item.FldLogsCtnPackgStsCode === '20' && (item.FldLogsCtnIntTranspStsCode === '25' || item.FldLogsCtnIntTranspStsCode === '10'));
    // Enable button only if all selected items have status code "20" and at least one is selected
    const enableDispatchedButton = selectedItems.length === 1 && selectedItems.every(item => item.FldLogsCtnPackgStsCode === '20' && item.FldLogsCtnIntTranspStsCode === '17' && item.FldLogsCtnVoyageStatus !== '20' && item.FldLogsVoyageAssignmentStatus !== '20');
    // Enable button only if no dispatched packed package exists
    const enableEditAllButton = !selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '20') && !selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '17');
    // Enable Assign to Voyage button only if none of the selected items are complete or transportation status dispatched
    const enableAssignToVoyageButton = selectedItems.length > 0 
        && selectedItems.every(item => item.FldLogsVoyageAssignmentStatus !== '20') 
        && !selectedItems.some(item => item.FldLogsCtnPackgStsCode === '30')
        && !selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '20');

    return CommonLibrary.enableToolBar(context, page, 'FLPackedContainersGoodsIssueItem', enableGoodsIssueButton)
        .then(() => CommonLibrary.enableToolBar(context, page, 'FLPackedContainersDispatchedItem', enableDispatchedButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'EditAll', enableEditAllButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'FLPackedContainersAssignToVoyageItem', enableAssignToVoyageButton));
}
