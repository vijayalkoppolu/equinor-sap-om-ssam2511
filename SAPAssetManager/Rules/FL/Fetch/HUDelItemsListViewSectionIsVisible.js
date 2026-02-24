import { FLDocumentTypeValues } from '../Common/FLLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function HUDelItemsListViewSectionIsVisible(context) {
    const documentType = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DocumentTypeListPicker').getValue());
    return [FLDocumentTypeValues.HandlingUnit, FLDocumentTypeValues.DeliveryItem].includes(documentType);
}
