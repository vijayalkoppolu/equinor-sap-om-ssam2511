import libCommon from '../../Common/Library/CommonLibrary';
import IsOverviewTabPage from '../../Common/TabPage/IsOverviewTabPage';
import FilterSettings from '../../Filter/FilterSettings';
import MyNotificationFilterQuery from '../MyNotificationFilterQuery';

//initialize the quick filter to only show My Notifications or In Progress Notifications
export default async function MyNotificationFastFilter(context) {
    //State variable when navigating to Notification List View screen from the My Notification section on homepage
    let myNotificationListView = libCommon.getStateVariable(context, 'MyNotificationListView');
    let inProgressListView = libCommon.getStateVariable(context, 'KPI-InProgress');
    if (myNotificationListView === true) {
        libCommon.removeStateVariable(context, 'MyNotificationListView');
        let user = libCommon.getSapUserName(context);
        const started = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
        return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'ReportedBy', undefined, ["ReportedBy eq '" + user + "' or NotifMobileStatus_Nav/MobileStatus eq '" + started + "'"], true, context.localizeText('sort_filter_prefix'), [context.localizeText('my_notifications_filter')])];
    }
    if (inProgressListView) {
        libCommon.removeStateVariable(context, 'KPI-InProgress');

        const HOLD = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        let criteria =  `(NotifMobileStatus_Nav/MobileStatus eq '${STARTED}' or NotifMobileStatus_Nav/MobileStatus eq '${HOLD}')`;
        return [context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [criteria], true, undefined, undefined)];
    }

    if (IsOverviewTabPage(context)) {
        let filters = [];
        const myNotificationsFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'MyWorkOrdersFilter', undefined, [MyNotificationFilterQuery(context)], true, '', [context.localizeText('my_notifications_filter')]);
        filters.push(myNotificationsFilter);
        FilterSettings.saveInitialFilterForPage(context, filters);
    
        // If saved filters exist, don't apply the default filters
        const savedFiltersExist = await FilterSettings.savedFilterSettingsExist(context);
        return savedFiltersExist ? []: filters;
    }
    return [];
}
