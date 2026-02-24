import IsS4ServiceOrderFeatureDisabled from '../../ServiceOrders/IsS4ServiceOrderFeatureDisabled';

export default function MyWorkSectionEmptySectionCaption(context) {
    if (IsS4ServiceOrderFeatureDisabled(context)) {
        return context.localizeText('s4_service_order_feature_disabled');
    }
    return context.localizeText('my_work_empty');
}
