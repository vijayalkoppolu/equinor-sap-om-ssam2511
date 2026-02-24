import IsAddS4RelatedObjectEnabled from '../../ServiceOrders/IsAddS4RelatedObjectEnabled';
import IsS4ServiceIntegrationNotEnabled from '../../ServiceOrders/IsS4ServiceIntegrationNotEnabled';

export default function IsNotesListCreateVisible(context) {
    if (IsS4ServiceIntegrationNotEnabled(context)) return true;
    return IsAddS4RelatedObjectEnabled(context);
}
