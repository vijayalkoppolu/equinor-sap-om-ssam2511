
export default function FLOrderOperationValues(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`,
        [],
        '$select=Operation',
    ).then(rows => {
        const seen = new Set();
        const items = [];

        for (const row of rows) {
            if (!seen.has(row.Operation)) {
                seen.add(row.Operation);
                items.push({
                    DisplayValue: row.Operation,
                    ReturnValue: row.Operation,
                });
            }
        }
        return items;
    });
}
