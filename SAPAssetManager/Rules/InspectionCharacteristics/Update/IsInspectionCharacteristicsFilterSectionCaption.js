import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';

export default async function IsInspectionCharacteristicsFilterSectionCaption(context) {
    return (await PersonalizationPreferences.isInspectionCharacteristicsListView(context)) ? '' : context.localizeText('save_data_before_filter_message');
}
