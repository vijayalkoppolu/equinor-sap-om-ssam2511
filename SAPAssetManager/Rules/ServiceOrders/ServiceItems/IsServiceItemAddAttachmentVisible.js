import DocumentsIsVisible from '../../Documents/DocumentsIsVisible';
import IsS4ServiceOrderNotCompletedAndCreateEnabled from './IsS4ServiceOrderNotCompletedAndCreateEnabled';

export default async function IsServiceItemAddAttachmentVisible(context) {
    const documentsIsVisible = DocumentsIsVisible(context);
    const isEnabled = await IsS4ServiceOrderNotCompletedAndCreateEnabled(context);
    return isEnabled && documentsIsVisible;
}
