import CommonLibrary from '../../Common/Library/CommonLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';

export default function EWMOrderViewSectionIsVisible(context) {
    const sectionType = DocumentTypes.WarehouseOrder;
    const documetType = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    return documetType === sectionType;
}
