import { CreateSerialMap } from '../InboundDelivery/SingleEdit/SerialNumber/IBDSerialNumberLib';
import Logger from '../../Log/Logger';

export default async function EDTNavigateToSingleEditItem(controlProxy, itemBinding = controlProxy.binding) {

    const table = controlProxy._control.getTable();
    const pageProxy = table.context.clientAPI.getPageProxy();
    if (!pageProxy) {
        throw new Error('Could not retrieve PageProxy from controlProxy');
    }

    // set values from EDT
    pageProxy.setActionBinding({
        ...itemBinding,
        Quantity:  `${table.getRowCellByName(0, 'Quantity').getValue()}`,
        UnitofMeasure: `${table.getRowCellByName(0, 'UOM').getValue()}`,
        StockType: `${table.getRowCellByName(0, 'StockType').getValue()}`,
    });

    if (itemBinding?.Serialized) {
            try {
                await CreateSerialMap(controlProxy, itemBinding);
            } catch (e) {
                Logger.error(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryCommon.global'), `Error setting serial number map: ${e}`);
                return Promise.reject(e);
            }
        }

    return pageProxy.executeAction('/SAPAssetManager/Actions/EWM/Inbound/IBDEditSingleItemNav.action');
}
