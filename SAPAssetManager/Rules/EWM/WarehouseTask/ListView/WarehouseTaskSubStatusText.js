import { isTaskConfirmed, GetConfirmedAndTotalQuantity} from '../../Common/EWMLibrary';

/**
 * Get the sub status text for the Warehouse Task quantity
 * @param {IClientAPI} context 
 */
export default function WarehouseTaskSubStatusText(context) {
    return isTaskConfirmed(context).then(isConfirmed => {
        if (isConfirmed) {
            return GetConfirmedAndTotalQuantity(context).then(({ confirmedQuantity, totalQuantity }) => {
                const formattedConfirmed = formatQuantity(confirmedQuantity);
                const formattedTotal = formatQuantity(totalQuantity);
                const text = context.localizeText('quantity_of_x_x', [formattedConfirmed, formattedTotal]);
                return `${text} ${context.binding.UoM}`;
            });
        } else {
            const formatted = formatQuantity(context.binding.Quantity);
            return `${formatted} ${context.binding.UoM}`;
        }
    }).catch(() => {
        const formatted = formatQuantity(context.binding.Quantity);
        return `${formatted} ${context.binding.UoM}`;
    });
}

function formatQuantity(quantity) {
    const number = parseFloat(quantity);
    return Math.round(number).toString();
}
