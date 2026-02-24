
import libVal from '../../Common/Library/ValidationLibrary';    
export default function FormatProductSubHead(clientAPI) {

    if (libVal.evalIsNotEmpty(clientAPI.binding.FldLogsReferenceDocumentNumber) && libVal.evalIsNotEmpty(clientAPI.binding.FldLogsRefDocType_Nav?.ReferenceDocumentCategoryName)) {
         return `${clientAPI.binding.FldLogsReferenceDocumentNumber} / ${clientAPI.binding?.FldLogsRefDocType_Nav?.ReferenceDocumentCategoryName}`;
    } else if (libVal.evalIsNotEmpty(clientAPI.binding.FldLogsReferenceDocumentNumber) && libVal.evalIsEmpty(clientAPI.binding.FldLogsRefDocType_Nav?.ReferenceDocumentCategoryName)) {
        return `${clientAPI.binding.FldLogsReferenceDocumentNumber}`;
    } else if (libVal.evalIsEmpty(clientAPI.binding.FldLogsReferenceDocumentNumber)) {
        return `${clientAPI.binding.FldLogsReferenceDocumentNumber}`;    
    } else if (libVal.evalIsEmpty(clientAPI.binding.FldLogsRefDocType_Nav.ReferenceDocumentCategoryName)) {
        return `${clientAPI.binding.FldLogsRefDocType_Nav.ReferenceDocumentCategoryName}`;    
    } else {
        return '';
    }
}
