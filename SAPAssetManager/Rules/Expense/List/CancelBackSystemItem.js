import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function CancelBackSystemItem(context) {
    if (IsCompleteAction(context)) {
        return '';
    }
    return 'Cancel';
}
