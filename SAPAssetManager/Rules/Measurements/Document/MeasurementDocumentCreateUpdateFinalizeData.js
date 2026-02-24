import libPoint from '../MeasuringPointLibrary';
import Logger from '../../Log/Logger';
import GenerateLocalID from '../../Common/GenerateLocalID';

export default async function MeasurementDocumentCreateUpdateFinalizeData(pageClientAPI) {
    //if in update, run update action else run create action
    /**Implementing our Logger class*/
    Logger.debug(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasurementDocuments.global').getValue(), 'Starting MeasurementDocumentCreateUpdateFinalizeData');

    if (libPoint.evalIsUpdateTransaction(pageClientAPI)) {
        pageClientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentUpdate.action');
    } else {
        const binding = pageClientAPI.binding;
        const localID = await GenerateLocalID(pageClientAPI, 'MeasurementDocuments', 'MeasurementDocNum', '000000000000', "$filter=startswith(MeasurementDocNum, 'LOCAL') eq true", 'LOCAL_M', 'SortField');
        binding.LocalID = localID;
        const properties = {
            'IsCounterReading': binding.IsCounter || '',
        };

        pageClientAPI.setActionBinding(binding);
        return pageClientAPI.executeAction({
            Name: '/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreate.action',
            Properties: {
                Properties: properties,
            },
        });
    }
    /**Implementing our Logger class*/
    Logger.debug(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasurementDocuments.global').getValue(), 'Finishing MeasurementDocumentCreateUpdateFinalizeData');

}
