import { HURelatedPhysicalInventoryProcedures } from '../../Common/EWMLibrary';

export default function HUMCompletedIsEditable(context, binding = context.binding) {

    const huCompleted = binding.HUComplCntd === 'X';
    const procedureType = binding.PhysInvProcedure;
    const huEnabled = HURelatedPhysicalInventoryProcedures.includes(procedureType) && !!binding.HandlingUnit;
    return huCompleted || (huEnabled && PIActiveSwitchPresent(context) === false);  //HU Completed switch works differently from other switches, as serial number can be added while it is active
}

export function PIActiveSwitchPresent(context, binding = context.binding) {
    const huCompleted = binding.HUComplCntd;
    const huMissing = binding.NoHU;
    const huEmpty = binding.HUEmpty;
    const zeroCount = binding.ZeroCount;
    const binEmpty = binding.EmptyBin;

    const switches = [huCompleted, huMissing, huEmpty, zeroCount, binEmpty];
    return switches.some(sw => sw === 'X');
}
