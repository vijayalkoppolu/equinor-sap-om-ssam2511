
export const UNSEALED_STATUS_FILTER = "FldLogsCtnPackgStsCode eq '30'";

export default async function FLPackContainerFilterCaptionUnsealed(context) {
    let baseFilter = `$filter=${UNSEALED_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdCtns', baseFilter)
        .then(count => {
            return context.localizeText('fld_unsealed_x', [count]);
        });
}
