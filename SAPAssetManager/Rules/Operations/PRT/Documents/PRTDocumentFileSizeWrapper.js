import DocumentFileSize from '../../../Documents/DocumentFileSize';
import IsOnlinePRT from '../IsOnlinePRT';

export default function PRTDocumentFileSizeWrapper(sectionProxy) {
    const doc = IsOnlinePRT(sectionProxy) ? sectionProxy.binding : sectionProxy.binding.PRTDocument;
    return DocumentFileSize(sectionProxy, doc);
}
