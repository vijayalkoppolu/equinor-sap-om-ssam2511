import { DocumentTypes } from '../Common/EWMLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function EWMPhysicalInventoryViewSectionIsVisible(context) {
    const sectionType = DocumentTypes.WarehousePhysicalInventoryItem;
    const documetType = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    return documetType === sectionType;
}
