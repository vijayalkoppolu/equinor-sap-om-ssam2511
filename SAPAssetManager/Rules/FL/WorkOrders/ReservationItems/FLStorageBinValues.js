

export default function FLStorageBinValues(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`,
        [],
        '$select=StorageBin',
    ).then(rows => {
        const seen = new Set();
        const items = [];

        for (const row of rows) {
            if (!seen.has(row.StorageBin)) {
                seen.add(row.StorageBin);
                items.push({
                    DisplayValue: row.StorageBin,
                    ReturnValue: row.StorageBin,
                });
            }
        }
        return items;
    });
}
