import CommonLibrary from '../../Common/Library/CommonLibrary';
import FLLibrary, {FLDocumentTypeValues} from '../Common/FLLibrary';

export default function OnDocumentSelectedOrUnselected(context) {
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding);

    const page = CommonLibrary.getPageName(context);
    // Only keep documents with status code "10"
    const goodsIssueDocuments = selectedItems
        .filter(item => item.FldLogsShptItmStsCode === '10')
        .map(item => {
            let document = FLLibrary.getDocumentData(item, FLDocumentTypeValues.ReadyToPack);
            document.ReadLink = item['@odata.readLink'];
            document.ObjectId = item.ObjectId;
            return document;
        });
    CommonLibrary.setStateVariable(context, 'RPGoodsIssueDocuments', goodsIssueDocuments);

    // Add documents with status code "27" to dispatchedDocuments
    const dispatchedDocuments = selectedItems
        .filter(item => item.FldLogsShptItmStsCode === '27')
        .map(item => {
            let document = FLLibrary.getDocumentData(item, FLDocumentTypeValues.ReadyToPack);
            document.ReadLink = item['@odata.readLink'];
            document.ObjectId = item.ObjectId;
            return document;
        });
    CommonLibrary.setStateVariable(context, 'RPDispatchedDocuments', dispatchedDocuments);

    // Enable button only if all selected items have status code "10" and at least one is selected
    const enableGoodsIssueButton = selectedItems.length === 1 && selectedItems.every(item => item.FldLogsShptItmStsCode === '10') && !(selectedItems.some(item => item.FldLogsShptItmStsCode === '27') && selectedItems.some(item => item.FldLogsVoyageAssignmentStatus === '20'));
    // Enable button only if all selected items have status code "10" and at least one is selected
    const enableDispatchedButton = selectedItems.length === 1 && selectedItems.every(item => item.FldLogsShptItmStsCode === '27') && !(selectedItems.some(item => item.FldLogsShptItmStsCode === '27') && selectedItems.some(item => item.FldLogsVoyageAssignmentStatus === '20'));
    // Enable button only if none of the item is dispatched 
    const enableEDTButton = !selectedItems.some(item => item.FldLogsShptItmStsCode === '30') && !(selectedItems.some(item => item.FldLogsShptItmStsCode === '27' && item.FldLogsVoyageAssignmentStatus === '20'));
    // Enable button only if at least one item is selected and no dispatched item exists
    const enableAssignContButton = selectedItems.length > 0 && !selectedItems.some(item => item.FldLogsShptItmStsCode === '30') && !(selectedItems.some(item => item.FldLogsShptItmStsCode === '27' && item.FldLogsVoyageAssignmentStatus === '20'));
    // Enable Assign to Voyage button if at least one item is selected (no filter on status)
    const enableAssignToVoyageButton = selectedItems.length > 0 && !selectedItems.some(item => item.FldLogsShptItmStsCode === '30') && !(selectedItems.some(item => item.FldLogsShptItmStsCode === '27') && selectedItems.some(item => item.FldLogsVoyageAssignmentStatus === '20'));
    
    
    return CommonLibrary.enableToolBar(context, page, 'FLReadyToPackGoodsIssueItem', enableGoodsIssueButton)
        .then(() => CommonLibrary.enableToolBar(context, page, 'FLReadyToPackDispatchedItem', enableDispatchedButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'EditAll', enableEDTButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', enableAssignContButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'FLReadyToPackAssignToVoyageItem', enableAssignToVoyageButton));
        
}
