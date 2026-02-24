import VehicleIsEnabled from '../Vehicle/VehicleIsEnabled';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function SideDrawerStockLookUp(context) {
    let isFieldServiceTechnician = PersonaLibrary.isFieldServiceTechnician(context);
    let isMaintenanceTechnician = PersonaLibrary.isMaintenanceTechnician(context);
    let isVehicleEnabled = VehicleIsEnabled(context);
    return (isMaintenanceTechnician || isFieldServiceTechnician) && isVehicleEnabled;
}
