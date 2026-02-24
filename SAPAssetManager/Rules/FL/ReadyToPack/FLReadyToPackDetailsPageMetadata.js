import ModifyKeyValueSection from   '../../LCNC/ModifyKeyValueSection';

export default async function FLReadyToPackDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/ReadyToPack/FLReadyToPackDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
