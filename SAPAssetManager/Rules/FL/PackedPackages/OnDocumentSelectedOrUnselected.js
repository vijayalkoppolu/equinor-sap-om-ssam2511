
import CommonLibrary from '../../Common/Library/CommonLibrary';
import FLLibrary, {FLDocumentTypeValues} from '../Common/FLLibrary';

export default function OnDocumentSelectedOrUnselected(context) {
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding);

    const page = CommonLibrary.getPageName(context);
    // Only keep documents with status in packing and transportation status not started
    const goodsIssueDocuments = selectedItems
        .filter(item => item.FldLogsCtnPackgStsCode === '10' && item.FldLogsCtnIntTranspStsCode === '10')
        .map(item => {
            let document = FLLibrary.getDocumentData(item, FLDocumentTypeValues.PackedPackages);
            document.ReadLink = item['@odata.readLink'];
            document.ObjectId = item.ObjectId;
            return document;
        });
    CommonLibrary.setStateVariable(context, 'PPGoodsIssueDocuments', goodsIssueDocuments);

    // Add documents with transportation status ready for dispatch
    const dispatchedDocuments = selectedItems
        .filter(item => item.FldLogsCtnPackgStsCode === '10' && item.FldLogsCtnIntTranspStsCode === '17')
        .map(item => {
            let document = FLLibrary.getDocumentData(item, FLDocumentTypeValues.PackedPackages);
            document.ReadLink = item['@odata.readLink'];
            document.ObjectId = item.ObjectId;
            return document;
        });
    CommonLibrary.setStateVariable(context, 'PPDispatchedDocuments', dispatchedDocuments);

    // Enable button only if all selected items have status code "10" and at least one is selected
    const enableGoodsIssueButton = selectedItems.length === 1 && selectedItems.every(item => item.FldLogsCtnPackgStsCode === '10' && item.FldLogsCtnIntTranspStsCode === '10');
    // Enable button only if all selected items have status code "10" and at least one is selected
    const enableDispatchedButton = selectedItems.length === 1 && selectedItems.every(item => item.FldLogsCtnPackgStsCode === '10' && item.FldLogsCtnIntTranspStsCode === '17') && !(selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '17') && selectedItems.some(item => item.FldLogsVoyageAssignmentStatus === '20'));
    // Enable button only if no dispatched packed package exists
    const enableEditAllButton = !selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '20') && !(selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '17' && item.FldLogsVoyageAssignmentStatus === '20'));
    // Enable button only if atleast one item is selected and no dispatched packed package exists
    const enableAssignToContainerButton = selectedItems.length > 0 && !selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '20') && !(selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '17' && item.FldLogsVoyageAssignmentStatus === '20'));
    // Enable Assign to Voyage button if at least one item is selected (no filter on status)
    const enableAssignToVoyageButton = selectedItems.length > 0 && !selectedItems.some(item => item.FldLogsCtnIntTranspStsCode === '20' || item.FldLogsVoyageAssignmentStatus === '20');
    
    return CommonLibrary.enableToolBar(context, page, 'FLPackedPackagesGoodsIssueItem', enableGoodsIssueButton)
        .then(() => CommonLibrary.enableToolBar(context, page, 'FLPackedPackagesDispatchedItem', enableDispatchedButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'EditAll', enableEditAllButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', enableAssignToContainerButton))
        .then(() => CommonLibrary.enableToolBar(context, page, 'FLPackedPackagesAssignToVoyageItem', enableAssignToVoyageButton))
        .then(() => context.getPageProxy()?.getControls()[1]?.redraw());
        
}
