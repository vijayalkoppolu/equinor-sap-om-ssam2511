import { getWarehouseTaskItem } from './WarehouseTaskConfirmationItem';

export default function SetWarehouseTaskItemProperty(context) {
    return getWarehouseTaskItem(context).then(taskItem => {
        const pageProxy = context.getPageProxy();
        if (pageProxy && pageProxy.getClientData()) {
            pageProxy.getClientData().WarehouseTaskItem = taskItem;
        }
        return taskItem;
    });
}
