import CommonLibrary from '../Common/Library/CommonLibrary';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import IsGISEnabled from '../Maps/IsGISEnabled';
import EnableStockLookUp from '../SideDrawer/EnableStockLookUp';
import EnableTechObjectsFacet from '../SideDrawer/EnableTechObjectsFacet';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import IsPMNotificationEnabled from '../UserFeatures/IsPMNotificationEnabled';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OverviewPageTabs(context) {
    let assignmentType = CommonLibrary.getWorkOrderAssnTypeLevel(context);
    let tabItems = [];
    if (assignmentType === 'Header') {
        tabItems.push({'DisplayValue': context.localizeText('orders'), 'ReturnValue': 'jobs'});
    } else if (assignmentType === 'Operation') {
        tabItems.push({'DisplayValue': context.localizeText('operations'), 'ReturnValue': 'jobs'});
    } else if (assignmentType === 'SubOperation') {
        tabItems.push({'DisplayValue': context.localizeText('sub_operations'), 'ReturnValue': 'jobs'});
    }
    if (IsGISEnabled(context)) tabItems.push({'DisplayValue': context.localizeText('map'), 'ReturnValue': 'map'});
    if (EnableTechObjectsFacet(context)) tabItems.push({'DisplayValue': context.localizeText('functional_locations'), 'ReturnValue': 'flocs'});
    if (EnableTechObjectsFacet(context)) tabItems.push({'DisplayValue': context.localizeText('equipment'), 'ReturnValue': 'equipment'});
    if (IsPMNotificationEnabled(context)) tabItems.push({'DisplayValue': context.localizeText('notifications'), 'ReturnValue': 'notifications'});
    if (ConfirmationsIsEnabled(context)) tabItems.push({'DisplayValue': context.localizeText('labor_time'), 'ReturnValue': 'time'});
    if (TimeSheetsIsEnabled(context)) tabItems.push({'DisplayValue': context.localizeText('time_sheets'), 'ReturnValue': 'time'});
    if (EnableStockLookUp(context)) tabItems.push({'DisplayValue': context.localizeText('parts'), 'ReturnValue': 'parts'});  
    
    return tabItems;
}
