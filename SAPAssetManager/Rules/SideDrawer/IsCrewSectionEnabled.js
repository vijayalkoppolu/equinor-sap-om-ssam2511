import IsCrewComponentEnabled from '../ComponentsEnablement/IsCrewComponentEnabled';
import IsFSMS4CrewComponentEnabled from '../ComponentsEnablement/IsFSMS4CrewComponentEnabled';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsCSServiceDataEnabled from '../UserFeatures/IsCSServiceDataEnabled';

export default function IsCrewSectionEnabled(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return IsFSMS4CrewComponentEnabled(context);
    }

    const isCrewComponentEnabled = IsCrewComponentEnabled(context);
    return IsCSServiceDataEnabled(context) ?
        isCrewComponentEnabled && MobileStatusLibrary.isOperationStatusChangeable(context) : // for FSM CS crew should be enabled only for operation level assignment 
        isCrewComponentEnabled;
}
