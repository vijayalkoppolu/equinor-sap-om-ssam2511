import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';
import ServiceOrderDetailsPageToOpen from './ServiceOrderDetailsPageToOpen';

export default async function ServiceOrderDetailsPageMetadata(clientAPI) {
    let pagePath = await ServiceOrderDetailsPageToOpen(clientAPI);
    let page = clientAPI.getPageDefinition(pagePath);
    return await ModifyKeyValueSection(clientAPI, page, 'OrderDetailsSection');
}
