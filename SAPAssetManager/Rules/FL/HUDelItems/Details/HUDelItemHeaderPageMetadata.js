import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function HUDelItemHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/HUDelItems/HUDelItemsHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
