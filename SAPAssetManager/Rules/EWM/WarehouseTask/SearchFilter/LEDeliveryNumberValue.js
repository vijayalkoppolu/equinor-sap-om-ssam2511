/**
 * Set LEDeliveryNumber control Value 
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Deliveries
 */
export default async function LEDeliveryNumberValue(context) {
    const proxy = context.getPageProxy();
    if (proxy._page._filter._filterResult) {
        const filterResult = proxy._page._filter._filterResult;
        const leDeliveryNumber = filterResult.filter(n => n._name === 'Delivery');
        if (leDeliveryNumber && leDeliveryNumber.length > 0) {
            const filter = leDeliveryNumber[0];
            if (filter._filterItems && filter._filterItems.length > 0) {
                return filter._filterItems[0];
            }
            return leDeliveryNumber.Value;
        }
    }
    return '';
}
