import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
import ServiceRequestDetailsPageToOpen from './Details/ServiceRequestDetailsPageToOpen';

export default async function ServiceRequestDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition(ServiceRequestDetailsPageToOpen(clientAPI));
    return await ModifyKeyValueSection(clientAPI, page, 'RequestDetailsSection');
}
