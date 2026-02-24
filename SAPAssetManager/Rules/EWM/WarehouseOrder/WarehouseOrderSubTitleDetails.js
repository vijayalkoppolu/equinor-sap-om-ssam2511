import WarehouseOrderCreationPossible from './WarehouseOrderCreationPossible';
export default function WarehouseOrderSubTitleDetails(context) {

    let subTitle = [];

    let WOCreationRule = WarehouseOrderCreationPossible(context);
    if (WOCreationRule) {
        subTitle.push(WOCreationRule);
    }
    if (context.binding?.WOProcessType) {
        subTitle.push(context.binding.WOProcessType);
    }
    if (context.binding?.Queue) {
        subTitle.push(context.binding.Queue);
    }
    return subTitle.join(', ');

}

