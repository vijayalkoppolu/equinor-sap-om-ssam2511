import authorizedTimeSheetCreate from '../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
import TimeSheetsIsEnabled from './TimeSheetsIsEnabled';

export default function TimeSheetCreateIsEnabled(context) {
    return TimeSheetsIsEnabled(context) && authorizedTimeSheetCreate(context);
}
