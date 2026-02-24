import { DocumentTypes } from '../Common/EWMLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import { Processes } from '../Common/EWMLibrary';

export default function GetDocumentTypes(context) {
    const enabledProcesses = libPersona.getEWMProcessesPreference(context);
    const isWarehouseEnabled = enabledProcesses?.includes(Processes.Warehouse);
    const isInboundEnabled = enabledProcesses?.includes(Processes.Inbound);

    const types = [];

    if (isWarehouseEnabled) {
        types.push(
            { DisplayValue: context.localizeText('warehouse_order'), ReturnValue: DocumentTypes.WarehouseOrder },
            { DisplayValue: context.localizeText('warehouse_task'), ReturnValue: DocumentTypes.WarehouseTask },
            { DisplayValue: context.localizeText('physical_inventory_label'), ReturnValue: DocumentTypes.WarehousePhysicalInventoryItem },
        );
    }

    if (isInboundEnabled) {
        types.push(
            { DisplayValue: context.localizeText('inbound_delivery'), ReturnValue: DocumentTypes.WarehouseInboundDelivery },
        );

    }

    return types;
}
