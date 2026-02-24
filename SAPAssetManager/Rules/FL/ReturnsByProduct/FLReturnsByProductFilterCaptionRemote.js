
export const AT_REMOTE_STATUS_FILTER = "FldLogsReturnStatus eq '10'";

export default async function FLReturnsByProductFilterCaptionRemote(context) {
    let baseFilter = `$filter=${AT_REMOTE_STATUS_FILTER}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsInitRetProducts', baseFilter)
        .then(count => {
            return context.localizeText('fld_remote_x', [count]);
        });
}
