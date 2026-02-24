
export const READY_FOR_DISPATCH_STATUS_FILTER = "FldLogsShptItmStsCode eq '27'";

export default async function FLReadyToPackFilterCaptionReadyForDispatch(context) {
    let baseFilter = `$filter=${READY_FOR_DISPATCH_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnRdyPcks', baseFilter)
        .then(count => {
            return context.localizeText('fld_ready_for_dispatch_x', [count]);
        });
}
