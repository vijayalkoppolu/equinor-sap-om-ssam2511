export default function FLPagesItemsSubhead(context) {
    const { FldLogsShptLocationId: locationId, FldLogsDestPlnt: destPLant } = context.binding;
    return [locationId, destPLant].filter(Boolean).join(' , ');
}
