

export default function FLResvItemsWBSValues(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`,
        [],
        '$select=WBSElementExternalID',
    ).then(rows => {
        const seen = new Set();
        const items = [];

        for (const row of rows) {
            if (!seen.has(row.WBSElementExternalID)) {
                seen.add(row.WBSElementExternalID);
                items.push({
                    DisplayValue: row.WBSElementExternalID,
                    ReturnValue: row.WBSElementExternalID,
                });
            }
        }
        return items;
    });
}
