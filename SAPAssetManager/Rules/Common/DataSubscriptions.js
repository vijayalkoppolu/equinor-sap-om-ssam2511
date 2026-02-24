
import libCom from '../Common/Library/CommonLibrary';
import SmartFormsFeatureIsEnabled from '../Forms/FSM/SmartFormsFeatureIsEnabled';

export default function DataSubscriptions(context) {
    let pageName = libCom.getPageName(context);
    let defaultDataSubs = [];
    switch (pageName) {
        case 'NotificationsListViewPage_tab':
        case 'NotificationsListViewPage':
            return [
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyNotificationActivities',
                'MyNotificationItems',
                'MyNotificationTasks',
                'MyNotificationItemActivities',
                'MyNotificationItemCauses',
                'MyNotificationItemTasks',
                'MyNotifHeaderLongTexts',
                'UserPreferences',
                'MyEquipments',
                'PMMobileStatuses',
                'CatsTimesheetOverviewRows',
                'ConfirmationOverviewRows',
            ];
        case 'OverviewPageClassic':
        case 'OverviewPageTabs':
        case 'OverviewPage':
            return [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                'UserFeatures',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'SideMenuDrawer': {
            defaultDataSubs = [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                'ErrorArchive',
                'UserFeatures',
                'Confirmations',
                'S4ServiceItems',
                'S4ServiceConfirmations',
                'PurchaseRequisitionHeaders',
                'S4ServiceRequests',
                'FldLogsVoyages',
                'FldLogsContainers',
                'FldLogsPackages',
                'FldLogsHuDelItems',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
            if (SmartFormsFeatureIsEnabled(context)) {
                defaultDataSubs.push('FSMFormInstances');
            }
            return defaultDataSubs;
        }
        case 'WorkOrdersListViewPage_tab':
        case 'WorkOrdersListViewPage':
            return [
                'PMMobileStatuses',
                'MyWorkOrderHeaderLongTexts',
                'UserTimeEntries',
                'MyWorkOrderPartners',
                'UserPreferences',
            ];
        case 'MeterDetailsPage':
        case 'PeriodicMeterDetailsPage':
            if (context.binding.ISUProcess !== 'INSTALL') {
                defaultDataSubs.push('Devices', 'DeviceGoodsMovements');
            }
            defaultDataSubs.push('MeterReadings');
            return defaultDataSubs;
        default:
            return defaultDataSubs;
    }
}
