/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { DocumentTypes,EWMType } from '../Common/EWMLibrary';
export default function OnDocumentSelectedOrUnSelected(context) {

    const documentType = libCom.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    const documentSection = {
        WHO : 'EWMOrderOnlineDocumentsListViewSection',
        WHT : 'EWMTaskOnlineDocumentListViewSection',
        WHPI: 'EWMPhysicalInventoryOnlineDocumentsListViewSection',
        WHIB: 'EWMInboundDeliveryOnlineDocumentsListViewSection',
    }[documentType];

    const objectTable  = context.getPageProxy()?.getControl('SectionedTable')?.getSection(documentSection);
    if (!libVal.evalIsEmpty(objectTable)) {
        let item = objectTable.getSelectionChangedItem();
        let documents = libCom.getStateVariable(context, 'Documents');
        if (libVal.evalIsEmpty(documents)) {
            documents = [];
        }

        if (item.selected) {
            let document = Object();
            const binding = item.binding;
            const type = item.binding['@odata.type'].substring('#sap_mobile.'.length);
            if ([
                    EWMType.WarehouseOrder,
                    EWMType.WarehouseTask,
                    EWMType.WarehousePhysicalInventoryItem,
                    EWMType.WarehouseInboundDelivery,
                ].includes(type)) {
                    document.WarehouseNum = binding?.WarehouseNum; //these shall be unified
                    document.WarehouseNo = binding?.WarehouseNo; //these shall be unified
                    document.WarehouseOrder = binding?.WarehouseOrder;
                    document.WarehouseTask = binding?.WarehouseTask;
                    document.GUID = binding?.GUID;
                    document.ITEM_NO = binding?.ITEM_NO;
                    document.DocumentID = binding?.DocumentID;
                    document.DocumentType = ({
                        [EWMType.WarehouseOrder]: DocumentTypes.WarehouseOrder,
                        [EWMType.WarehouseTask]: DocumentTypes.WarehouseTask,
                        [EWMType.WarehousePhysicalInventoryItem]: DocumentTypes.WarehousePhysicalInventoryItem,
                        [EWMType.WarehouseInboundDelivery]: DocumentTypes.WarehouseInboundDelivery,
                    })[type];
                }
            documents.push(document);

            libCom.setStateVariable(context, 'Documents', documents);
        } else {
            handleUnselectedItem(documents, item, context);
        }
    }
    return true;
}
function handleUnselectedItem(documents, item, context) {
    let newDocuments = [];
    if (documents.length > 0) {
        for (let document of documents) {
            if (!(document.WarehouseNo === item.binding.WarehouseNo && document.WarehouseOrder === item.binding.WarehouseOrder)) {
                let newDocument = Object();
                newDocument.WarehouseNo = document.WarehouseNo;
                newDocument.WarehouseOrder = document.WarehouseOrder;
                newDocument.DocumentType = document.DocumentType;
                newDocuments.push(newDocument);
            }
        }
    }
    libCom.setStateVariable(context, 'Documents', newDocuments);
}
