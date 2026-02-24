import CommonLibrary from '../Common/Library/CommonLibrary';
import FSMCrewLibrary from '../Crew/FSMCrewLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsFSMS4CrewComponentEnabled(context) {
    return FSMCrewLibrary.isFSMCrewFeatureEnabled(context) &&
            IsS4ServiceIntegrationEnabled(context) &&
            CommonLibrary.getS4AssnTypeLevel(context) === 'Item';
}
