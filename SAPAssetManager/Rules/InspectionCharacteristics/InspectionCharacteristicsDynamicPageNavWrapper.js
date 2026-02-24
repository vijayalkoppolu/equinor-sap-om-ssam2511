import InspectionCharacteristicsDynamicPageNav from './InspectionCharacteristicsDynamicPageNav';
import InspectionCharacteristicsEDTDynamicPageNav from './InspectionCharacteristicsEDTDynamicPageNav';
import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';

export default async function InspectionCharacteristicsDynamicPageNavWrapper(context) {
    if (await PersonalizationPreferences.isInspectionCharacteristicsListView(context)) {
        return InspectionCharacteristicsDynamicPageNav(context);
    }
    return InspectionCharacteristicsEDTDynamicPageNav(context);
}
