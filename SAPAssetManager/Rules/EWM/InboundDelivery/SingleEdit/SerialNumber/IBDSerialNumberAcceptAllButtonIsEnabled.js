import { GetIBDSerialNumbers } from './IBDSerialNumberLib';

export default function IBDSerialNumberAcceptAllButtonIsEnabled(context) {
    const serialNumberMap = GetIBDSerialNumbers(context);
    const quantityToConfirm = parseInt(context.evaluateTargetPath('#Page:EditInboundDeliveryItemPage/#Control:QuantityInput/#Value'));
    const serialQuantity = serialNumberMap?.length || 0;
    return serialQuantity !== 0 && parseFloat(quantityToConfirm) === parseFloat(serialQuantity);
}
