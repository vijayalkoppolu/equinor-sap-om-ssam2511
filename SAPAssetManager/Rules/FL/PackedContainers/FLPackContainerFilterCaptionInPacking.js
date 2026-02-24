
export const IN_PACKING_STATUS_FILTER = "FldLogsCtnPackgStsCode eq '10'";

export default async function FLPackContainerFilterCaptionInPacking(context) {
    let baseFilter = `$filter=${IN_PACKING_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdCtns', baseFilter)
        .then(count => {
            return context.localizeText('fld_in_packing_x', [count]);
        });
}
