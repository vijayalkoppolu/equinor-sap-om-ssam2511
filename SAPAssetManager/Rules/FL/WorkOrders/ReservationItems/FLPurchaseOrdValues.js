

export default function FLPurchaseOrdValues(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`,
        [],
        '$select=PurchaseOrd',
    ).then(rows => {
        const seen = new Set();
        const items = [];

        for (const row of rows) {
            if (!seen.has(row.PurchaseOrd)) {
                seen.add(row.PurchaseOrd);
                items.push({
                    DisplayValue: row.PurchaseOrd,
                    ReturnValue: row.PurchaseOrd,
                });
            }
        }
        return items;
    });
}
