import IsAndroid from '../../Common/IsAndroid';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function CancelBackIcon(context) {
    if (IsCompleteAction(context) && IsAndroid(context)) {
        return 'sap-icon://arrow-left';
    }
    return '';
}
