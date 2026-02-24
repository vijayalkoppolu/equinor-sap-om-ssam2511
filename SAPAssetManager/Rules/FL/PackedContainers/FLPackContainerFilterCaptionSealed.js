
export const SEALED_STATUS_FILTER = "FldLogsCtnPackgStsCode eq '20'";

export default async function FLPackContainerFilterCaptionSealed(context) {
    let baseFilter = `$filter=${SEALED_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnPkdCtns', baseFilter)
        .then(count => {
            return context.localizeText('fld_sealed_x', [count]);
        });
}
