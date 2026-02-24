import { WarehouseOrderStatus } from '../../Common/EWMLibrary';

export default function WarehouseOrderStatusText(context) {
    const status = context.binding.WOStatus;
    if (status === WarehouseOrderStatus.Open) {
        return context.localizeText('open_ewm_items');
    } else if (status === WarehouseOrderStatus.InProgess) {
        return context.localizeText('in_process_ewm_items');
    } else if (status === WarehouseOrderStatus.Confirmed) {
        return context.localizeText('confirmed_ewm_items');
    }
    return '';
}

