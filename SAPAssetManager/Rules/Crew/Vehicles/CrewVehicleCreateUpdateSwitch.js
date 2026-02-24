import common from '../../Common/Library/CommonLibrary';
import point from './CrewVehicleOdometerPoint';
import ODataLibrary from '../../OData/ODataLibrary';

export default function CrewVehicleCreateUpdateSwitch(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            if (ODataLibrary.isLocal(result.getItem(0))) {
                return context.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleUpdateMeasurementDocument.action');
            } else {
                common.setStateVariable(context, 'ObjectCreatedName', 'Document');
                return context.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleCreateMeasurementDocument.action');
            }
        } else {
            common.setStateVariable(context, 'ObjectCreatedName', 'Document');
            return context.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleCreateMeasurementDocument.action');
        }
    });
}
