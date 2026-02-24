export default async function FLReturnsByProductFilterCaptionReadyForDispatch(context) {
    const READY_FOR_DISPATCH_STATUS_FILTER = "FldLogsReturnStatus eq '40'";
    let baseFilter = `$filter=${READY_FOR_DISPATCH_STATUS_FILTER}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsInitRetProducts', baseFilter)
        .then(count => {
            return context.localizeText('fld_ready_for_dispatch_x', [count]);
        });
}
