/**
 * Get the title for the Warehouse Task
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns 
 */
export default function WarehouseTaskTitle(context) {

    if (context.binding.WarehouseTask_Nav) {
         return Promise.resolve(context.binding.WarehouseTask_Nav.Product ? [context.binding.WarehouseTask_Nav.Product, context.binding.WarehouseTask_Nav.ProductDescription].filter(i => !!i).join(' - ') : '');
    } else {
        return Promise.resolve(context.binding.Product ? [context.binding.Product, context.binding.ProductDescription].filter(i => !!i).join(' - ') : '');
    }

}
