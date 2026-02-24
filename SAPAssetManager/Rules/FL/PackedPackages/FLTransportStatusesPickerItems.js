export default function FLTransportStatusesPickerItems(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'FldLogsPackCtnPkdPkgs',
        [],
        '$select=FldLogsCtnIntTranspStsCode,FldLogsShptCtnIntTranspStsText').then(rows => {
            const seen = new Set();
            const items = [];

            for (const row of rows) {
                if (!seen.has(row.FldLogsCtnIntTranspStsCode)) {
                    seen.add(row.FldLogsCtnIntTranspStsCode);
                    items.push({
                        DisplayValue: row.FldLogsShptCtnIntTranspStsText,
                        ReturnValue: row.FldLogsCtnIntTranspStsCode,
                    });
                }
            }
            return items;
        });
}
