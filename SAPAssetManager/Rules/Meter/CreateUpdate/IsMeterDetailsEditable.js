import MeterLibrary from '../Common/MeterLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function IsMeterDetailsEditable(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    let isLocal = context?.binding?.Device_Nav ? ODataLibrary.hasAnyPendingChanges(context.binding.Device_Nav) : false;

    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();
    return meterTransactionType === REMOVE_EDIT ? isLocal : true;
}
