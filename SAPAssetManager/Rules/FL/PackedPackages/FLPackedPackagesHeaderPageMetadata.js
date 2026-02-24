import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
 
export default async function FLPackedPackagesHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/PackedPackages/PackedPackagesHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
