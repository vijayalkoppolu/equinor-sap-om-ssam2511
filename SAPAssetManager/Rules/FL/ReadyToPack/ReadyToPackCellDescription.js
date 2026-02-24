export default function ReadyToPackCellDescription(context) {
    let qty = context.binding.HandlingUnitQuantity;
    const extId = context.binding.HandlingUnitExternalId ?? '';
    let status = context.binding.FldLogsVoyAssgmtStatusText ?? ''; 
    status = status ? context.localizeText('fld_voyage', [status]) : '';
    let firstLine = '';
    if (qty !== undefined && qty !== null && Number(qty) !== 0 && String(qty).trim() !== '') {
        firstLine = `${qty}, ${extId}`;
    } else {
        firstLine = extId;
    }
    const statusLine = status ? context.localizeText('fld_voyage', [status]) : '';
    return `${statusLine}\n${firstLine}`;
}
