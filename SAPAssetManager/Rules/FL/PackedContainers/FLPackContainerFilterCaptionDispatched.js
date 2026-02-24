export const DISPATCHED_STATUS_FILTER = "FldLogsCtnIntTranspStsCode eq '20'";

export default async function FLPackContainerFilterCaptionDispatched(context) {
    let baseFilter = `$filter=${DISPATCHED_STATUS_FILTER}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdCtns', baseFilter)
        .then(count => {
            return context.localizeText('fld_dispatched_x', [count]);
        });
}
