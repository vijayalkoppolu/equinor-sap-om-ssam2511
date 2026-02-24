
export const AVAILABLE_FOR_PACK_STATUS_FILTER = "FldLogsShptItmStsCode eq '10'";

export default async function FLReadyToPackFilterCaptionAvailableForPacking(context) {
    let baseFilter = `$filter=${AVAILABLE_FOR_PACK_STATUS_FILTER}`;
    return await context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackCtnRdyPcks', baseFilter)
        .then(count => {
            return context.localizeText('available_for_pack_status', [count]);
        });
}
