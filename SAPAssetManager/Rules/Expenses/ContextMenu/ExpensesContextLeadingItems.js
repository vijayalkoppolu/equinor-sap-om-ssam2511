import ODataLibrary from '../../OData/ODataLibrary';
export default function ExpensesContextLeadingItems(context) {
    const local = ODataLibrary.hasAnyPendingChanges(context.binding);
    let actions = [];

    if (local) {
        actions.push('Edit_Expense');
    }

    return actions;
}
