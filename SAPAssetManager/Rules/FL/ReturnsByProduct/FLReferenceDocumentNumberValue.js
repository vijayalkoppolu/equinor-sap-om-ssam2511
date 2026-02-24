/**
 * Set FLReferenceDocumentNumberFilter control Value
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context
 * @returns {string}
 */
export default async function FLReferenceDocumentNumberValue(context) {
    const proxy = context.getPageProxy();
    if (proxy._page._filter && proxy._page._filter._filterResult) {
        const filterResult = proxy._page._filter._filterResult;
        const refDocNumber = filterResult.filter(n => n._name === 'FldLogsReferenceDocumentNumber');
        if (refDocNumber && refDocNumber.length > 0) {
            const filter = refDocNumber[0];
            if (filter._filterItems && filter._filterItems.length > 0) {
                return filter._filterItems[0];
            }
            return filter.Value;
        }
    }
    return '';
}
