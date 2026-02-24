import libPersona from '../Persona/PersonaLibrary';
import { Processes } from '../EWM/Common/EWMLibrary';

export default function IsWarehouseMenuItemsVisible(context) {
    return libPersona.isExtendedWarehouseClerk(context) && !!libPersona.getEWMProcessesPreference(context)?.includes(Processes.Warehouse);
}
