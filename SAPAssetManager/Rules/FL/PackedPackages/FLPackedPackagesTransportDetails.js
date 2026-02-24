export default function FLPackedPackagesTransportDetails(context) {
    const transportDetails = context.binding.FldLogsShptCtnIntTranspStsText;
    return transportDetails ? context.localizeText('fld_transport', [transportDetails]) : '';
}
