import { SetSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import Logger from '../../../Log/Logger';

/**
 * @param {IClientAPI} context 
 * @returns action
 */
export default async function WarehouseTaskLocalConfirmationNav(context) {
    try {
        await SetSerialNumberMap(context); // Wait for SetSerialNumberMap to complete
        return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskLocalConfirmationEditNav.action');
    } catch (e) {
        Logger.error(
            context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global'),
            `WarehouseTaskLocalConfirmationNav Error ${e}`,
        );
    }
}
