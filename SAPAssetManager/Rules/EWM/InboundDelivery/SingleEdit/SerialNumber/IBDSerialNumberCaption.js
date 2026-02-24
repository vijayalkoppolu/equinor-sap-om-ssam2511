import { GetIBDSerialNumbers } from './IBDSerialNumberLib';

export default function IBDSerialNumberCaption(context) {
    const serialNumbersMap = GetIBDSerialNumbers(context);
    
        if (!serialNumbersMap || !serialNumbersMap.length) {
            return context.localizeText('serial_numbers');
        } else {
            const confirmed = serialNumbersMap.filter(item => item.selected).length;
            const total = serialNumbersMap.length;
    
            return context.localizeText('serial_numbers_x_x', [confirmed, total]);
        }
}
