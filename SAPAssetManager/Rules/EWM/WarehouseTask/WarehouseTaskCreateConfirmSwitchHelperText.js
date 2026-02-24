import WarehouseTaskCreateConfirmSwitchEditable from './WarehouseTaskCreateConfirmSwitchEditable';

export default function WarehouseTaskCreateConfirmSwitchHelperText(context) {
    return WarehouseTaskCreateConfirmSwitchEditable(context) ? '' : context.localizeText('create_serialized_task_confirm_helper_text');
}
