import libCom from '../../../Common/Library/CommonLibrary';
import { HURelatedPhysicalInventoryProcedures } from '../../Common/EWMLibrary';
/**
 * This rule is used to update the quantity field when returning from the serial number page.
 */
export default function PhysicalInventoryCountUpdateOnReturning(context, binding = context.binding) {
    if (binding.Serialized) {
        const initialNumbers = libCom.getStateVariable(context, 'SerialNumbers').initial;
        if (libCom.getStateVariable(context, 'SerialSuccess')) {
            let quantity = libCom.getControlProxy(context, 'QuantitySimple');
            const zero = libCom.getControlProxy(context, 'ZeroCountSwitch');
            const huMissing = libCom.getControlProxy(context, 'HUMissingSwitch');
            const huEmpty = libCom.getControlProxy(context, 'EmptyHUSwitch');
            const binEmpty = libCom.getControlProxy(context, 'EmptyBinSwitch');
            const huComplete = libCom.getControlProxy(context, 'HUCompleteSwitch');
            const switches = [zero, huMissing, huEmpty, binEmpty, huComplete];
            const huSwitches = [huMissing, huEmpty, huComplete];
            const newValue = initialNumbers.filter(item => item.Selected).length;
            const bookQuantity = binding.BookInventory;
            const procedureType = binding.PhysInvProcedure;
            const handlingUnit = binding.HandlingUnit;
            const HUSwitchesEnabled = !!handlingUnit && HURelatedPhysicalInventoryProcedures.includes(procedureType);
            quantity.setValue(newValue);
            if (newValue > 0) {
                libCom.setStateVariable(context, 'Quantity', newValue);
                switches.forEach(sw => {
                    if (sw === huComplete) {
                        sw.setEditable(HUSwitchesEnabled);
                        if (newValue !== Number(bookQuantity))
                            sw.setValue(false);
                    }  else {
                        sw.setEditable(false);
                        sw.setValue(false);
                    }  //Cannot set to zero count or HU exception with serial numbers in cache
                });
            } else {
                switches.forEach(sw => {
                    if (huSwitches.includes(sw)) {
                        sw.setEditable(HUSwitchesEnabled);
                    } else {
                        sw.setEditable(true);
                    }
                });

                libCom.setStateVariable(context, 'Quantity', binding.Quantity);
            }
        } else {
            libCom.setStateVariable(context, 'SerialNumbers', { actual: initialNumbers, initial: initialNumbers });
        }
    }
}
