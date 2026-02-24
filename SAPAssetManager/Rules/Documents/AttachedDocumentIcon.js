import libVal from '../Common/Library/ValidationLibrary';
import DocumentsIsVisible from './DocumentsIsVisible';


export default function AttachedDocumentIcon(context, docs, docsCount, docProp = 'Document') {
    const docIcon = 'sap-icon://attachment';
    const isDocumentsEnabled = DocumentsIsVisible(context);

    if (isDocumentsEnabled) {
        if (!libVal.evalIsEmpty(docs)) {
            if (docs.some(doc => doc[docProp] && !libVal.evalIsEmpty(doc[docProp].FileName))) {
                return docIcon;
            }
        } else if (docsCount > 0) {
            return docIcon;
        }
    }

    return undefined;
}
