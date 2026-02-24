import ModifyKeyValueSection from '../../../../LCNC/ModifyKeyValueSection';

/**
 * Modify page metadata for Product Details
 * @param {IClientAPI} clientAPI
 * @returns page modifications
 */
export default async function FLProductDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/WorkOrders/FLProductDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
