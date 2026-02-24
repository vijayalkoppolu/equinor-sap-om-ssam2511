import libEval from '../../Common/Library/ValidationLibrary';
import IsGeometryEditAllowed from '../../Geometries/IsGeometryEditAllowed';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import { getGeometryData } from '../../Common/GetLocationInformation';
import ODataLibrary from '../../OData/ODataLibrary';

export default function WorkOrderDeleteGeometryAllowed(context) {
    if (!IsGeometryEditAllowed(context)) return false;

    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            return ODataLibrary.isLocal(context.binding);
        }
    // Otherwise, determine if we should have geometry data
    }
    return getGeometryData(context.getPageProxy(), 'MyWorkOrderHeader', null, false).then(geometryData => {
        if (libEval.evalIsEmpty(geometryData)) {
            // there could be geometry obtained from current location or parent object or from map
            let geometry = ApplicationSettings.getString(context, 'Geometry');
            let isLocal = (context.binding['@odata.readLink'])? ODataLibrary.isLocal(context.binding) : true;
            return (!libEval.evalIsEmpty(geometry) && isLocal);
        }
        return true;
    }, () => {
        // there could be geometry obtained from current location or parent object or from map
        let geometry = ApplicationSettings.getString(context, 'Geometry');
        let isLocal = (context.binding['@odata.readLink'])? ODataLibrary.isLocal(context.binding) : true;
        return (!libEval.evalIsEmpty(geometry) && isLocal);
    });
}
