import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import MeasuringPointsEDTNav from '../Points/EDT/MeasuringPointsEDTNav';

export default async function MeasurementDocumentCreateNav(clientAPI) {
    libCom.setStateVariable(clientAPI, 'TransactionType', 'CREATE');
    libCom.setStateVariable(clientAPI, 'SingleReading', libCom.getPageName(clientAPI) === 'MeasuringPointDetailsPage');

    if (await PersonalizationPreferences.isMeasuringPointListView(clientAPI)) {
        /**Implementing our Logger class*/
        Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasurementDocuments.global').getValue(), 'Starting MeasurementDocumentCreateUpdateNav');
        if (!clientAPI) {
            throw new TypeError('Context can\'t be null or undefined');
        }
        clientAPI.getPageProxy().setActionBinding(clientAPI.binding);
        return clientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
    }
    return MeasuringPointsEDTNav(clientAPI);
}
