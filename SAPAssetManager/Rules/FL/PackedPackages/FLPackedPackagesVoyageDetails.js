export default function FLPackedPackagesVoyageDetails(context) {
    const voyageDetails = context.binding.FldLogsVoyAssgmtStatusText;
    return voyageDetails ? context.localizeText('fld_voyage', [voyageDetails]) : '';
}


