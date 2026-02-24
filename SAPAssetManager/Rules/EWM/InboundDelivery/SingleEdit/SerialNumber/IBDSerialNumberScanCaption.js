import { GetIBDSelectedCount, GetIBDSerialNumbers } from './IBDSerialNumberLib';

export default function IBDSerialNumberScanCaption(context) {
    const quantityToConfirm = parseInt(context.evaluateTargetPath('#Page:-Previous/#Control:QuantityInput/#Value')) || 0;
    const selectedcount = GetIBDSelectedCount(GetIBDSerialNumbers(context));
    const remaining = quantityToConfirm - selectedcount;
    return context.localizeText('scan_serial_number', [remaining]);
}
