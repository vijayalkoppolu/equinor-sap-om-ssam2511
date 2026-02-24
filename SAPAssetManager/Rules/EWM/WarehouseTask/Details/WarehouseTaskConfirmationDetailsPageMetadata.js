import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

/**
 * Modify page metatdata
 * 
 * @param {IClientAPI} clientAPI 
 * @returns page modifications
 */
export default async function WarehouseTaskConfirmationDetailsPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/EWM/WarehouseTasks/WarehouseTaskConfirmationDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WarehouseTaskDetails0');
}
