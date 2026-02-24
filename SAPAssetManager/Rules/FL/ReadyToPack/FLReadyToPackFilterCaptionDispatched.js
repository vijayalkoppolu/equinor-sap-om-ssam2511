
export const DISPATCHED_STATUS_FILTER = "FldLogsShptItmStsCode eq '30'";

export default async function FLReadyToPackFilterCaptionDispatched(context) {
    let baseFilter = `$filter=${DISPATCHED_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnRdyPcks', baseFilter)
        .then(count => {
            return context.localizeText('fld_dispatched_x', [count]);
        });
}
