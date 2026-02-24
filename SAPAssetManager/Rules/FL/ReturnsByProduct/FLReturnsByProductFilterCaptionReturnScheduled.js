export default async function FLReturnsByProductFilterCaptionReturnScheduled(context) {
    const RETURN_SCHEDULED_STATUS_FILTER = "FldLogsReturnStatus eq '30'";
    let baseFilter = `$filter=${RETURN_SCHEDULED_STATUS_FILTER}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsInitRetProducts', baseFilter)
        .then(count => {
            return context.localizeText('fld_return_scheduled_x', [count]);
        });
}
