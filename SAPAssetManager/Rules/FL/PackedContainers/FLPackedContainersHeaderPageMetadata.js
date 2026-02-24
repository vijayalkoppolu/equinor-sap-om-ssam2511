import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
 
export default async function FLPackedContainersHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/PackedContainers/PackedContainersHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
