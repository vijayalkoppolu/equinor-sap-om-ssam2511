export default function WarehouseTaskFootnote(clientAPI) {
    const binding = clientAPI.binding;
    const srcHU = binding.SrcHU;
    const destHU = binding.DestHU;
    const sourceHU = binding.SourceHU;
    const destinationHU = binding.DestinationHU;
    const handlingUnit = srcHU || destHU || sourceHU || destinationHU;

    if (binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        if (srcHU && destHU) {
            return clientAPI.localizeText('warehouse_task_hu_x_x', [srcHU, destHU]);
        }
    } else {
        if (sourceHU && destinationHU) {
            return clientAPI.localizeText('warehouse_task_hu_x_x', [sourceHU, destinationHU]);
        }
    }

    if (handlingUnit) {
        return clientAPI.localizeText('warehouse_task_hu_x', [handlingUnit]);
    }

    return '';
}
