import { DocumentTypes } from '../Common/EWMLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function EWMTaskSectionIsVisible(context) {
    const sectionType = DocumentTypes.WarehouseTask;
    const documetType = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    return documetType === sectionType;
}
