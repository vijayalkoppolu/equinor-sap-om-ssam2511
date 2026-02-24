import ModifyKeyValueSection from   '../../LCNC/ModifyKeyValueSection';

export default async function FLPackedContainersDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/PackedContainers/FLPackedContainersDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
