export default function WHHandlingUnitLoadingWeight(context) {
    const loadingweight = context.binding?.LoadingWeight ?? '-';
    const uom = context.binding?.LoadingWeightUoM;
    const value = context.localizeText('hu_loading_weight', [loadingweight]);
    
    return  `${value}${uom ? ' ' + uom : ''}`;
}
