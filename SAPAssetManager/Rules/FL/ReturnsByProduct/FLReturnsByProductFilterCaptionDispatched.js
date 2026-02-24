export default async function FLReturnsByProductFilterCaptionDispatched(context) {
    const DISPATCHED_STATUS_FILTER = "FldLogsReturnStatus eq '50'";
    let baseFilter = `$filter=${DISPATCHED_STATUS_FILTER}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsInitRetProducts', baseFilter)
        .then(count => {
            return context.localizeText('fld_dispatched_x', [count]);
        });
}
