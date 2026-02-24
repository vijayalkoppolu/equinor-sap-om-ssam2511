import ODataLibrary from '../../OData/ODataLibrary';
export default function ExpensesContextTrailingItems(context) {
    const local = ODataLibrary.hasAnyPendingChanges(context.binding);
    let actions = [];

    if (local) {
        actions.push('Delete_Expense');
    }

    return actions;
}
