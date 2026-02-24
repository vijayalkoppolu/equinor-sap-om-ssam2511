export const DISPATCHED_STATUS_FILTER = "FldLogsCtnIntTranspStsCode eq '20'";

export default async function FLPackedPackagesFilterCaptionDispatched(context) {
    let baseFilter = `$filter=${DISPATCHED_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdPkgs', baseFilter)
        .then(count => {
            return context.localizeText('fld_dispatched_x', [count]);
        });
}
