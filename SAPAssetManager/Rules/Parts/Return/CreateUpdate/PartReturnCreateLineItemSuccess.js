import libPart from '../../PartLibrary';
import libTelemetry from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function PartReturnCreateLineItemSuccess(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    libTelemetry.logUserEvent(pageClientAPI,
        pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Parts.global').getValue(),
        libTelemetry.EVENT_TYPE_RETURN);

    return libPart.partReturnCreateLineItemSuccess(pageClientAPI);

}
