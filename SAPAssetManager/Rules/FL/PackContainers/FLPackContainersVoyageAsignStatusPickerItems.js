export default function FLVoyageAsignStatusPickerItems(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'FldLogsPackCtnPkdCtns',
        [],
        '$select=FldLogsVoyAssgmtStatusText,FldLogsShptCtnIntTranspStsText').then(rows => {
            const seen = new Set();
            const items = [];

            for (const row of rows) {
                if (!seen.has(row.FldLogsVoyAssgmtStatusText)) {
                    seen.add(row.FldLogsVoyAssgmtStatusText);
                    items.push({
                        DisplayValue: row.FldLogsShptCtnIntTranspStsText,
                        ReturnValue: row.FldLogsVoyAssgmtStatusText,
                    });
                }
            }
            return items;
        });
}
