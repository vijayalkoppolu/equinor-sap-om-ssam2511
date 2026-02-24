import IsS4ServiceOrderCreateEnabled from '../../ServiceOrders/CreateUpdate/IsS4ServiceOrderCreateEnabled';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';

export default function ObjectCardServiceOrderButtonVisible(context) {
    return IsFSMS4SectionVisible(context) ? IsServiceOrderLevel(context) && IsS4ServiceOrderCreateEnabled(context) : false;
}
