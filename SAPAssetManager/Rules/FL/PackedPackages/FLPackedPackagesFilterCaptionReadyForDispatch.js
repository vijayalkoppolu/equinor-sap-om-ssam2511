export const READY_FOR_DISPATCH_STATUS_FILTER = "FldLogsCtnIntTranspStsCode eq '17'";

export default async function FLPackedPackagesFilterCaptionReadyForDispatch(context) {
    let baseFilter = `$filter=${READY_FOR_DISPATCH_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdPkgs', baseFilter)
        .then(count => {
            return context.localizeText('fld_ready_for_dispatch_x', [count]);
        });
}
