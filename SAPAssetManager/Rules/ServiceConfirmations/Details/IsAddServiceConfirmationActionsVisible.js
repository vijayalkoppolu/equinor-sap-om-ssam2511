import IsEditServiceConfirmationEnabled from '../../Confirmations/Details/IsEditServiceConfirmationEnabled';
import AddConfirmationToServiceItemEnabled from '../../ServiceOrders/ServiceItems/AddConfirmationToServiceItemEnabled';
import IsS4ServiceQuotationCreateEnabled from '../../ServiceQuotations/IsS4ServiceQuotationCreateEnabled';

export default function IsAddServiceConfirmationActionsVisible(context) {
    return AddConfirmationToServiceItemEnabled(context) || IsEditServiceConfirmationEnabled(context) || IsS4ServiceQuotationCreateEnabled(context);
}
