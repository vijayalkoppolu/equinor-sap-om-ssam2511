import IsS4ServiceOrderFeatureDisabled from './IsS4ServiceOrderFeatureDisabled';

export default function S4ServiceOrderEmptySectionText(context) {
    if (IsS4ServiceOrderFeatureDisabled(context)) {
        return context.localizeText('s4_service_order_feature_disabled');
    }
    return context.localizeText('no_serviceorders_available');
}
