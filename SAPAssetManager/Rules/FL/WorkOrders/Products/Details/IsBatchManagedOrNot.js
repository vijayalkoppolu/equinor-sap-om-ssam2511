/**
 * @param {IClientAPI} context
 */
export default function IsBatchManagedOrNot(context) {
    return context.localizeText(context.binding?.IsBatchManaged === 'X' ? 'yes' : 'no');
}
