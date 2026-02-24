export default async function WHInboundDeliveryItemsHusAndTasks(context) {
    let taskCount = 0;
    let huCount = 0;
    try {
        taskCount = await context.count(
            '/SAPAssetManager/Services/AssetManager.service',
            `${context.binding['@odata.readLink']}/WarehouseTask_Nav`,
        );
    } catch (error) {
        console.error('Failed to fetch task count:', error);
    }

    try {
        huCount = await context.count(
            '/SAPAssetManager/Services/AssetManager.service',
            `${context.binding['@odata.readLink']}/HandlingUnitItem_Nav`,
        );
    } catch (error) {
        console.error('Failed to fetch Handling Unit count:', error);
    }

    const husText = context.localizeText('ewm_hus_x', [huCount]);
    const tasksText = context.localizeText('ewm_tasks_x', [taskCount]);

    return `${husText}, ${tasksText}`;
}
