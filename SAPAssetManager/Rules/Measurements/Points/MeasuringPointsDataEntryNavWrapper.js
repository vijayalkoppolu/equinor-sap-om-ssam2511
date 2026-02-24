import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import MeasuringPointsDataEntryNav from './MeasuringPointsDataEntryNav';
import MeasuringPointsEDTNav from './EDT/MeasuringPointsEDTNav';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default async function MeasuringPointsDataEntryNavWrapper(context) {
    CommonLibrary.setStateVariable(context, 'TransactionType', 'CREATE');
    CommonLibrary.setStateVariable(context, 'SingleReading', false);

    if (await PersonalizationPreferences.isMeasuringPointListView(context)) {
        return MeasuringPointsDataEntryNav(context);
    }
    return MeasuringPointsEDTNav(context);
}
