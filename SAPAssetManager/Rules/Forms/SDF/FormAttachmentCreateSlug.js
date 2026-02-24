import {slugRegex, default as FormInstanceCreateUpdateSlug } from './FormInstanceCreateUpdateSlug';

/**
 * get the existing slug for instance creation and add fields for the attachment
 * @param {*} clientAPI 
 * @returns {Promise<string>}
 */
export default async function FormAttachmentCreateSlug(clientAPI) {
    let context = clientAPI;

    const prefix = await FormInstanceCreateUpdateSlug(clientAPI);

    const headers = [
        'AppName',
        'FormName',
        'FormVersion',
        'FormInstanceID',
        'AttachmentID',
        'MimeType',
        'ObjectType',
        'TechnicalEntityType',
    ]
    .map((key) => [key, context.evaluateTargetPath(`#Page:FormRunner/#ClientData/AttachmentData/${key}`)]);

    const headerstring = headers.map(([key,value]) => {
        if (slugRegex.test(value)) {
            return `${key}=${value}`;
        }
        return `${key}="${encodeURIComponent(value)}"`;
    })
    .join(',');

    return `${prefix},${headerstring}`;
}
