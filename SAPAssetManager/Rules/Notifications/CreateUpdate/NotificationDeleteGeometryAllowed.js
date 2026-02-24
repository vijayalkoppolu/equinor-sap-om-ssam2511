import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import { getGeometryData } from '../../Common/GetLocationInformation';
import ODataLibrary from '../../OData/ODataLibrary';

export default function NotificationDeleteGeometryAllowed(context) {
    // If we already have geometry data...
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            return ODataLibrary.isLocal(context.binding);
        }
    // Otherwise, determine if we should have geometry data
    }
    return getGeometryData(context.getPageProxy(), 'MyNotificationHeader', null, false).then(geometryData => {
        if (ValidationLibrary.evalIsEmpty(geometryData)) {
            // there could be geometry obtained from current location or parent object or from map
            let geometry = ApplicationSettings.getString(context, 'Geometry');
            let isLocal = (context.binding['@odata.readLink'])? ODataLibrary.isLocal(context.binding) : true;
            return (!ValidationLibrary.evalIsEmpty(geometry) && isLocal);
        }
        return true;
    }, () => {
        // there could be geometry obtained from current location or parent object or from map
        let geometry = ApplicationSettings.getString(context, 'Geometry');
        let isLocal = (context.binding['@odata.readLink'])? ODataLibrary.isLocal(context.binding) : true;
        return (!ValidationLibrary.evalIsEmpty(geometry) && isLocal);
    });
}
