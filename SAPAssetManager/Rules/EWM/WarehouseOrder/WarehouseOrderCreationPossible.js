export default function WarehouseOrderCreationPossible(context) {
    let WOCreationRule = context.binding?.WOCreationRule;
    if (WOCreationRule && WOCreationRule !== 'DEF' && WOCreationRule !== 'UNDE') {
        return WOCreationRule;
    } 
    return null;
}
