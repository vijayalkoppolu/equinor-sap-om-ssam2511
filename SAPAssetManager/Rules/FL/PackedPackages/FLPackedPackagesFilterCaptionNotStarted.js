export const NOT_STARTED_STATUS_FILTER = "FldLogsCtnIntTranspStsCode eq '10'";

export default async function FLPackedPackagesFilterCaptionNotStarted(context) {
    let baseFilter = `$filter=${NOT_STARTED_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdPkgs', baseFilter)
        .then(count => {
            return context.localizeText('fld_not_started_x', [count]);
        });
}
