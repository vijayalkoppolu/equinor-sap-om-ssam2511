import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
 
export default async function FLReadyToPackHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/ReadyToPack/ReadyToPackHeaderPage.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
