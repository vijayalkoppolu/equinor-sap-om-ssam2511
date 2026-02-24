export const READY_FOR_DISPATCH_STATUS_FILTER = "FldLogsCtnIntTranspStsCode eq '17'";

export default async function FLPackContainerFilterCaptionReadyForDispatch(context) {
    let baseFilter = `$filter=${READY_FOR_DISPATCH_STATUS_FILTER}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdCtns', baseFilter)
        .then(count => {
            return context.localizeText('fld_ready_for_dispatch_x', [count]);
        });
}
