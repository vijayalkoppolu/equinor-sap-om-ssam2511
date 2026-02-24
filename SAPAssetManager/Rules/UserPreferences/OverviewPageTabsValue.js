import PersonalizationPreferences from './PersonalizationPreferences';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import IsGISEnabled from '../Maps/IsGISEnabled';
import EnableTechObjectsFacet from '../SideDrawer/EnableTechObjectsFacet';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import IsPMNotificationEnabled from '../UserFeatures/IsPMNotificationEnabled';
import IsWorkOrderEnabled from '../UserFeatures/IsWorkOrderEnabled';
import CommonLibrary from '../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OverviewPageTabsValue(context) {
    return PersonalizationPreferences.getOverviewPageTabs(context).then(tabItems => {
        if (ValidationLibrary.evalIsEmpty(tabItems)) {
            // check if default tab values are set in App Params
            let defaultTabsString = CommonLibrary.getAppParam(context, 'PERSONALIZATION', 'MT.OverviewTabs');
            if (ValidationLibrary.evalIsNotEmpty(defaultTabsString)) {
                let defaultTabs = defaultTabsString.split(',');
                defaultTabs.forEach(tab => {
                    switch (tab) { // jobs,map,flocs,equipment,notifications,time,parts
                        case 'jobs': if (IsWorkOrderEnabled(context)) tabItems.push('jobs'); break;
                        case 'map': if (IsGISEnabled(context)) tabItems.push('map'); break;
                        case 'flocs': if (EnableTechObjectsFacet(context)) tabItems.push('flocs'); break;
                        case 'equipment': if (EnableTechObjectsFacet(context)) tabItems.push('equipment'); break;
                        case 'notifications': if (IsPMNotificationEnabled(context)) tabItems.push('notifications'); break;
                        case 'time': if (ConfirmationsIsEnabled(context) || TimeSheetsIsEnabled(context)) tabItems.push('time'); break;
                        case 'parts': tabItems.push('parts'); break;
                    }
                });
            }
            return tabItems;
        }
        return tabItems;
    });
}
