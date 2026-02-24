import ComLib from '../Common/Library/CommonLibrary';

export default function SideDrawerWarehouseTaskCount(context) {
     return ComLib.getEntitySetCount(context, 'WarehouseTasks').then(count=>{
        return context.localizeText('warehouse_tasks_x', [count]);
    });
}
