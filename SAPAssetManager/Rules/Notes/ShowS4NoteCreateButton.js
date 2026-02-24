import IsS4ConfirmationItemIsNotCompletedAndCreateEnabled from '../Confirmations/Item/IsS4ConfirmationItemIsNotCompletedAndCreateEnabled';
import IsAddS4RelatedObjectEnabled from '../ServiceOrders/IsAddS4RelatedObjectEnabled';
import IsS4ServiceOrderNotCompletedAndCreateEnabled from '../ServiceOrders/ServiceItems/IsS4ServiceOrderNotCompletedAndCreateEnabled';

export default function ShowS4NoteCreateButton(context, binding = context.binding) {
    let enabled = true;

    const entityName = binding?.['@odata.type'];
    switch (entityName) {
        case '#sap_mobile.S4ServiceItem':
        case '#sap_mobile.S4ServiceOrder':
            enabled = IsS4ServiceOrderNotCompletedAndCreateEnabled(context);
            break;
        case '#sap_mobile.S4ServiceConfirmationItem':
            enabled = IsS4ConfirmationItemIsNotCompletedAndCreateEnabled(context);
            break;
        default:
            enabled = IsAddS4RelatedObjectEnabled(context);
    }

    return enabled;
}
