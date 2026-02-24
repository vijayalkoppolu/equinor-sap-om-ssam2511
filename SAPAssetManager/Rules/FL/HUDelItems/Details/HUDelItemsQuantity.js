import { formatQuantityAndUnit } from '../../ContainerItems/ContainerItemsQuantity';

export default function HUDelItemsQuantity(context) {
    return formatQuantityAndUnit(context.binding.RetblQtyInOrderUnit, context.binding.RetblQtyOrderUnit);
}
