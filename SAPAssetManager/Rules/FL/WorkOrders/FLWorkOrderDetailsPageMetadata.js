import ModifyKeyValueSection from   '../../LCNC/ModifyKeyValueSection';

export default async function FLWorkOrderDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/WorkOrders/FLWorkOrderDetail.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
