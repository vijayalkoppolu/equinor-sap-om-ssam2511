import ChangeExpensesFinalize from '../../WorkOrders/Complete/Expenses/ChangeExpensesFinalize';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import ConfirmExpenseListClose from './ConfirmExpenseListClose';

export default function CancelBackButtonPressed(context) {
    if (IsCompleteAction(context)) {
        return ChangeExpensesFinalize(context);
    }
    return ConfirmExpenseListClose(context);
}
