import { CreateSerialMap } from './SerialNumber/IBDSerialNumberLib';
import Logger from '../../../Log/Logger';

export default async function IBDEditSingleItemNav(context, binding = context.getPageProxy()?.getActionBinding() || context.binding) {
    if (binding?.Serialized) {
        try {
            await CreateSerialMap(context, binding);
        } catch (e) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global'), `Error setting serial number map: ${e}`);
            return Promise.reject(e);
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/IBDEditSingleItemNav.action');
}
