import libCommon from '../Common/Library/CommonLibrary';
import libDoc from './DocumentLibrary';

export default function DocumentTypeIcon(context) {
    let binding = context.getBindingObject();
    const doc = libDoc.getDocumentFromBinding(binding);
    let docType = doc.MimeType;
    let icon = 'sap-icon://document';
    if (libCommon.isDefined(docType)) {
        if (docType.includes('text') || docType.includes('word') || docType.includes('wordprocessingml')) {
           icon = 'sap-icon://document-text';
        } else if (docType.includes('video')) {
           icon = 'sap-icon://attachment-video';
        } else if (docType.includes('image') || docType.includes('jpeg') || docType.includes('jpg')) {
            icon = 'sap-icon://attachment-photo';
        } else if (docType.includes('audio')) {
            icon = 'sap-icon://attachment-audio';
        } else if (docType.includes('pdf')) {
            icon = 'sap-icon://pdf-attachment';
        } else if (docType.includes('csv') || docType.includes('separated-values')) {
            icon = '/SAPAssetManager/Images/csv-file.pdf';
        }  else if (docType.includes('excel') || docType.includes('spreadsheetml')) {
            icon = 'sap-icon://excel-attachment';
        } else if (docType.includes('powerpoint') || docType.includes('presentationml')) {
            icon = 'sap-icon://excel-attachment';
        }
    }
    return icon;
}
