import { PIActiveSwitchPresent } from './HUCompletedIsEditable';

/**
* The function will return true if the serial number button should be shown
* @param {IClientAPI} clientAPI
*/
export default function ShowSerialNumberButton(context, binding = context.binding) {
    const huCompleted = binding.HUComplCntd === 'X'; //HU Complete is the only exception switch that allows serial number addition
    return !!binding.Serialized && (PIActiveSwitchPresent(context) === false || huCompleted);
}
