import Logger from '../../Log/Logger';

export default function FormInstanceCreateLinks(context) {
    const readLink = context?.binding?.['@odata.readLink'];
    const entityType = context?.binding?.['@odata.type'];

    let property = '';
    let entityset = '';

    switch (entityType) {
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
            property = 'MyWorkOrderHeader_Nav';
            entityset = 'MyWorkOrderHeaders';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue():
            property = 'MyWorkOrderOperation_Nav';
            entityset = 'MyWorkOrderOperations';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue():
            property = 'MyWorkOrderSubOperation_Nav';
            entityset = 'MyWorkOrderSubOperations';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue():
            property = 'MyNotificationHeader_Nav';
            entityset = 'MyNotificationHeaders';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue():
            property = 'MyEquipment_Nav';
            entityset = 'MyEquipments';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue():
            property = 'MyFunctionalLocation_Nav';
            entityset = 'MyFunctionalLocations';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue():
            property = 'S4ServiceOrder_Nav';
            entityset = 'S4ServiceOrders';
            break;    
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue():
            property = 'S4ServiceItem_Nav';
            entityset = 'S4ServiceItems';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue():
            property = 'WCMApplication_Nav';
            entityset = 'WCMApplications';
            break;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue():
            property = 'WCMDocumentHeader_Nav';
            entityset = 'WCMDocumentHeaders';
            break;    
        default:
            Logger.error(`Found no valid entity type for link creation. ${entityType}`);
            return [];
    }
    const instanceReadLink = context.evaluateTargetPath('#ActionResults:CreateDynamicFormInstanceResult/#Property:data/#Property:@odata.readLink');

    const links = [
		{
			Property: `${property}`,
			Target: {
				EntitySet: `${entityset}`,
				ReadLink: `${readLink}`,
			},
		},
		{
			Property: 'DynamicFormInstance_Nav',
			Target: {
				EntitySet: 'DynamicFormInstances',
				ReadLink: `${instanceReadLink}`,
			},
		},
	];

    return links;
}
