import Logger from '../../Log/Logger';

/**
 * 
 * @param {IClientAPI} context 
 * @returns {[string,string]} ObjectKey, ObjectType, TechnicalEntityType. undefined if unknown entity type or unable to find the id
 */
export default function getTechnicalEntityKeys(context) {
    const entityType = context?.binding?.['@odata.type'];
    let technicalKeys = {key: undefined, objectType: undefined, entityType: undefined};

    try {
        switch (entityType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
                technicalKeys = {key: context.binding.OrderId, objectType: 'WORK_ORDER', entityType: 'WOHEADER'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue():
                technicalKeys = {key: context.binding.OrderId, objectType: 'WORK_ORDER', entityType: 'WOOPERATION'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue():
                technicalKeys = {key: context.binding.OrderId, objectType: 'WORK_ORDER', entityType: 'WOSUBOPERATION'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue():
                technicalKeys = {key: context.binding.NotificationNumber, objectType: 'NOTIFICATION', entityType: 'NOTIFHEADER'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue():
                technicalKeys = {key: context.binding.EquipId, objectType: 'EQUIPMENT', entityType: 'EQUIPMENT'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue():
                technicalKeys = {key: context.binding.FuncLocIdIntern, objectType: 'FUNCLOC', entityType: 'FUNCLOC'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue():
                technicalKeys = {key: context.binding.ObjectID, objectType: 'S4_SRV_ORDER', entityType: 'S4SRVORDHEADER'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue():
                technicalKeys = {key: context.binding.ObjectID, objectType: 'S4_SRV_ORDER', entityType: 'S4SRVORDITEM'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue():
                technicalKeys = {key: context.binding.WCMApplication, objectType: 'WCM_APPLICATION', entityType: 'WCMAPP'};
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue():
                technicalKeys = {key: context.binding.WCMDocument, objectType: 'WCM_DOCUMENT', entityType: 'WCMDOCHEADER'};
                break;
            default:
                break;
        }
        return technicalKeys;
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `could not identify technical entity id/type: ${entityType}`);
    }

    return technicalKeys;
}
