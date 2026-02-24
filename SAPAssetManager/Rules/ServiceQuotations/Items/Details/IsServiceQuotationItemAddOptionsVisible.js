import IsAddS4RelatedObjectEnabled from '../../../ServiceOrders/IsAddS4RelatedObjectEnabled';
import IsS4ServiceQuotationCreateEnabled from '../../IsS4ServiceQuotationCreateEnabled';

export default function IsServiceQuotationItemAddOptionsVisible(context) {
    return [
        IsS4ServiceQuotationCreateEnabled(context),
        IsAddS4RelatedObjectEnabled(context),
    ].some(visibility => visibility);
}
