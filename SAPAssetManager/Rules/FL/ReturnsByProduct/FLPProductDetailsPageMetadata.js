import ModifyKeyValueSection from   '../../LCNC/ModifyKeyValueSection';

export default async function FLProductDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/ReturnsByProduct/FLPProductDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
