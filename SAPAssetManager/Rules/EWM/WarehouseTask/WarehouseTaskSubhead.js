import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WarehouseTaskSubhead(context) {
    const binding = context.binding;

    const warehouseTaskFormatted = CommonLibrary.removeLeadingZeros(binding.WarehouseTask) || '-';
 
    const warehouseTaskItem = binding.WarehouseTaskItem;
    
    return `${warehouseTaskFormatted} - ${warehouseTaskItem}`;
}
