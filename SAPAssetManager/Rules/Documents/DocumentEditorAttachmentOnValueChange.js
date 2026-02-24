import attachmentFileName from './DocumentEditorAttachmentFileName';
import saveAttachment from './DocumentEditorSaveAttachment';
import isImageFormat from './DocumentEditorIsImageFormat';
import attachmentEditorOpen from './DocumentEditorAttachmentOpen';
import isPdfFormat from './DocumentEditorIsPdfFormat';

export default function DocumentEditorAttachmentOnValueChange(context) {
    const attachmentsValue = filterAttachmentsByAllowedFileTypes(context);

    const attachmentCount = attachmentsValue.length;
    let attachmentCountBeforeValueChanged = context.getClientData().attachmentCount;

    if (!attachmentCountBeforeValueChanged) {
        attachmentCountBeforeValueChanged = 0;
    }

    let openEditor = false;
    let editableAttachmentIndex, editableAttachment, editableAttachmentFileName;

    if (attachmentCount > attachmentCountBeforeValueChanged) {
        const isOneAttachmentAdded = (attachmentCount - attachmentCountBeforeValueChanged) === 1;

        if (isOneAttachmentAdded) { // checks if only one attachment was added
            editableAttachmentIndex = attachmentCount - 1;
            editableAttachment = attachmentsValue[editableAttachmentIndex];
            editableAttachmentFileName = attachmentFileName(editableAttachment);
            openEditor = isImageFormat(editableAttachmentFileName) || isPdfFormat(editableAttachmentFileName);
        } else { // checks if in multiple added attachments only one is editable
            const addedEditableAttachments = attachmentsValue.slice(attachmentCountBeforeValueChanged, attachmentCount).filter(attachment => {
                const fileName = attachmentFileName(attachment);
                return isImageFormat(fileName) || isPdfFormat(fileName);
            });

            if (addedEditableAttachments.length === 1) {
                editableAttachment = addedEditableAttachments[0];
                editableAttachmentIndex = attachmentsValue.findIndex(attachment => attachment === editableAttachment);
                editableAttachmentFileName = attachmentFileName(editableAttachment);
                openEditor = true;
            }
        }
    }

    context.getClientData().attachmentCount = attachmentCount;
    return openEditor ? openAttachmentEditor(context, editableAttachment, editableAttachmentFileName, editableAttachmentIndex) : Promise.resolve();
}

function openAttachmentEditor(context, attachment, fileName, attachmentIndex) {
    const directory = saveAttachment(context, attachment, fileName);
    return attachmentEditorOpen(context, fileName, directory, { AttachmentIndex: attachmentIndex });
}

function filterAttachmentsByAllowedFileTypes(context) {
    const allowedFileTypes = (context.getAllowedFileTypes() || []).map(type => type.toLowerCase());
    const attachments = context.getValue();

    if (!allowedFileTypes.length) {
        return attachments;
    }
    
    const newAttachments = attachments.filter(attachment => {
        const fullFileName = attachment.urlStringWithFileName || attachment.urlString;
        const type = fullFileName.split('.').pop();
        // Check if the type is in the allowed file types or 
        // if it matches the full file name in case of type cannot be determined from file name
        return allowedFileTypes.includes(type.toLowerCase()) || type === fullFileName;
    });

    if (attachments.length !== newAttachments.length) {
        context.setValue(newAttachments, false);
    }

    return newAttachments;
}
