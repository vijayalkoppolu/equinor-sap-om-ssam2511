import { DocumentTypes } from '../Common/EWMLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function EWMInboundDeliveryViewSectionIsVisible(context) {
    const sectionType = DocumentTypes.WarehouseInboundDelivery;
    const documetType = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    return documetType === sectionType;
}
