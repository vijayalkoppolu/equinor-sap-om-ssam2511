/**
 * ASN Number Picker for Inbound Delivery filter
 */
export default async function ASNPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveries', [], '$select=ASN&$orderby=ASN')
        .then(results => {
            const uniqueASNs = [...new Set(Array.from(results, item => item.ASN))];
            return uniqueASNs
                .filter(asn => asn)
                .map(asn => ({
                    DisplayValue: `${asn}`,
                    ReturnValue: `${asn}`,
                }));
        });
}
