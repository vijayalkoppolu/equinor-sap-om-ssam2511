
export default function FLPurchaseReqValues(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`,
        [],
        '$select=PurchaseReq',
    ).then(rows => {
        const seen = new Set();
        const items = [];

        for (const row of rows) {
            if (!seen.has(row.PurchaseReq)) {
                seen.add(row.PurchaseReq);
                items.push({
                    DisplayValue: row.PurchaseReq,
                    ReturnValue: row.PurchaseReq,
                });
            }
        }
        return items;
    });
}
