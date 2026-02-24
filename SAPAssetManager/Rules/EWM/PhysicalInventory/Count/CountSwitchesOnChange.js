import libCom from '../../../Common/Library/CommonLibrary';
import GetQuantityText from './GetQuantityText';
import { HURelatedPhysicalInventoryProcedures } from '../../Common/EWMLibrary';

/**
 * Switch changes for Physical Inventory count
 * @param {IClientAPI} context
 */
export default function CountSwitchesOnChange(context, binding = context.binding) {
    const pageProxy = context.getPageProxy();

    const quantity = libCom.getControlProxy(pageProxy, 'QuantitySimple');
    const serial = libCom.getControlProxy(pageProxy, 'SerialNumberAdd');
    const zero = libCom.getControlProxy(pageProxy, 'ZeroCountSwitch');
    const huMissing = libCom.getControlProxy(pageProxy, 'HUMissingSwitch');
    const huEmpty = libCom.getControlProxy(pageProxy, 'EmptyHUSwitch');
    const huComplete = libCom.getControlProxy(pageProxy, 'HUCompleteSwitch');
    const binEmpty = libCom.getControlProxy(pageProxy, 'EmptyBinSwitch');

    const showSerial = !!binding.Serialized;
    const SerialNumbers = showSerial ? libCom.getStateVariable(context, 'SerialNumbers')?.initial : [];
    const activeSerials = (SerialNumbers?.filter(item => item.Selected) || []).length;
    const switches = [zero, huMissing, huEmpty, huComplete, binEmpty];
    const huSwitches = [huMissing, huEmpty, huComplete];
    const handlingUnit = binding.HandlingUnit;
    const procedureType = binding.PhysInvProcedure;
    const HUSwitchesEnabled = !!handlingUnit && HURelatedPhysicalInventoryProcedures.includes(procedureType);
    const bookQuantity = binding.BookInventory;
    const activeSwitch = switches.find(sw => sw.getValue());

    if (activeSwitch) {
        if (activeSwitch === zero && quantity) {
            quantity.setHelperText('');
        }

        quantity.setValue(activeSwitch === huComplete ? bookQuantity : '0');
        quantity.setEditable(false);
        quantity.clearValidation();
        if (showSerial && activeSwitch !== huComplete) {
            serial.setVisible(false);
        }

        disableOtherSwitches(switches, activeSwitch);
    } else {
        quantity.setEditable(!showSerial);
        if (showSerial) 
            quantity.setValue(activeSerials ? String(activeSerials) : '0');
        else
            quantity.setValue('');

        serial.setVisible(showSerial);

        if (quantity) {
            const helperText = GetQuantityText(context);
            quantity.setHelperText(helperText);
        }    

        if (!showSerial || activeSerials === 0) {
            switches.forEach(sw => {
                if (huSwitches.includes(sw)) {       //HU Switches shouldn't be enabled if there is no HandlingUnit for the PI Item or the PI Procedure is not for Handling Unit
                    sw.setEditable(HUSwitchesEnabled);
                } else {
                    sw.setEditable(true);
                }
            });
        }
    }

    return Promise.resolve(true);
}

function disableOtherSwitches(switches, activeSwitch) {
    switches.forEach(sw => {
        if (sw !== activeSwitch) {
            sw.setEditable(false);
            sw.setValue(false);
        }
    });
}
