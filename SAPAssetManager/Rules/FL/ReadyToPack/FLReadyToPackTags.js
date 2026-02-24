export default function FLReadyToPackTags(clientAPI) {
    let tags = [];
    if (clientAPI.binding.FldLogsVoyAssgmtStatusText) {
        tags.push(clientAPI.localizeText('fld_voyage_colon', [clientAPI.binding.FldLogsVoyAssgmtStatusText]));
    }
    return tags;
}
