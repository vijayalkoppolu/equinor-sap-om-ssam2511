import { GetIBDSelectedCount, GetIBDSerialNumbers, UpdateIBDControls, UpdateIBDSerialNumberMap } from './IBDSerialNumberLib';


export default function SerialNumberOnPress(context) {
    const serialNumberMap = GetIBDSerialNumbers(context);
    const quantityToConfirm = parseInt(context.evaluateTargetPath('#Page:-Previous/#Control:QuantityInput/#Value'));
    const target = context.getPageProxy().getActionBinding();
    const entry = serialNumberMap.find((item) => item.entry.SerialNumber === target.SerialNumber);
    if (entry) {
        if (!entry.selected) {
            if (quantityToConfirm - GetIBDSelectedCount(serialNumberMap) > 0) {
                entry.selected = !entry.selected;
            } else {
                return;
            }
        } else {
            entry.selected = !entry.selected;
        }
        UpdateIBDSerialNumberMap(context, serialNumberMap);
        UpdateIBDControls(context, serialNumberMap);
    }
}
