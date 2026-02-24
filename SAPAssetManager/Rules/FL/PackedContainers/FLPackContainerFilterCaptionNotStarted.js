export const NOT_STARTED_STATUS_FILTER = "FldLogsCtnIntTranspStsCode eq '10'";

export default async function FLPackContainerFilterCaptionNotStarted(context) {
    let baseFilter = `$filter=${NOT_STARTED_STATUS_FILTER}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdCtns', baseFilter)
        .then(count => {
            return context.localizeText('fld_not_started_x', [count]);
        });
}
