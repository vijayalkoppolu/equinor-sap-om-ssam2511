/**
 * Determines if the operation picker should be editable based on whether an order is selected.
 * @param {IClientAPI} context
 * @param {Object} binding
 * @returns {boolean}
 */
export default function PartOperationIsEditable(context, binding = context.binding) {
    return !!binding?.OrderId;
}
