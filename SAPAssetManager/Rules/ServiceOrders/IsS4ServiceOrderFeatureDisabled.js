import IsS4ServiceOrderFeatureEnabled from './IsS4ServiceOrderFeatureEnabled';

export default function IsS4ServiceOrderFeatureDisabled(context) {
    return !IsS4ServiceOrderFeatureEnabled(context);
}
