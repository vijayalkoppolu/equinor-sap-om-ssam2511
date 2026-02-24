
export default function FLStorageBinValues(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`,
        [],
        '$select=RemoteStorageLocation',
    ).then(rows => {
        const seen = new Set();
        const items = [];

        for (const row of rows) {
            if (!seen.has(row.RemoteStorageLocation)) {
                seen.add(row.RemoteStorageLocation);
                items.push({
                    DisplayValue: row.RemoteStorageLocation,
                    ReturnValue: row.RemoteStorageLocation,
                });
            }
        }
        return items;
    });
}
