import ComLib from '../Common/Library/CommonLibrary';

export default function SideDrawerPhysicalInventoryCount(context) {
     return ComLib.getEntitySetCount(context, 'WarehousePhysicalInventoryItems').then(count=>{
        return context.localizeText('physical_inventory_x', [count]);
    });
}
