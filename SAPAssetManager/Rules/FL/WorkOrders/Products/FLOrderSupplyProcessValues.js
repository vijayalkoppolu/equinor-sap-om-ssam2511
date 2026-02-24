
export default function FLOrderSupplyProcessValues(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoProduct_Nav`,
        [],
        '$select=SupplyProcess').then(rows => {
            const seen = new Set();
            const items = [];

            for (const row of rows) {
                if (!seen.has(row.SupplyProcess)) {
                    seen.add(row.SupplyProcess);
                    items.push({
                        DisplayValue: row.SupplyProcess,
                        ReturnValue: row.SupplyProcess,
                    });
                }
            }
            return items;
        });
}
