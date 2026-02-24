import ModifyKeyValueSection from   '../../LCNC/ModifyKeyValueSection';

export default async function FLPackedPackagesDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/PackedPackages/FLPackedPackagesDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
