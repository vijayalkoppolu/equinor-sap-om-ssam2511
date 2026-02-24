import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function CancelBackCaption(context) {
    if (IsCompleteAction(context)) {
        return context.localizeText('go_back');
    }
    return context.localizeText('cancel');
}
