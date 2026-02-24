import PersonalizationPreferences from '../UserPreferences/PersonalizationPreferences';
import CommonLibrary from '../Common/Library/CommonLibrary';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import IsGISEnabled from '../Maps/IsGISEnabled';
import EnableTechObjectsFacet from './EnableTechObjectsFacet';
import IsPMNotificationEnabled from '../UserFeatures/IsPMNotificationEnabled';
import EnableStockLookUp from './EnableStockLookUp';

export default function MTTabHomeScreenNav(context) {
    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/OverviewTabs.page');

    return updatePageTabs(context, page).then(()=> {

        return context.executeAction({
            Name: '/SAPAssetManager/Actions/Common/GenericNav.action',
            Properties: {
                PageMetadata: page,
                ClearHistory: true,
                ModalPage: false,
            },
            Type: 'Action.Type.Navigation',
        });
    });   
}

async function updatePageTabs(context, page) {
    let tabs = []; // possible tabs: jobs,map,flocs,equipment,notifications,time,parts
    return PersonalizationPreferences.getOverviewPageTabs(context).then(selectedTabs => {
        if (selectedTabs.includes('jobs')) {
            if (CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'Header') {
                tabs.push(addTab('jobs', '/SAPAssetManager/Rules/SideDrawer/SideDrawerWorkOrdersCount.js', '/SAPAssetManager/Rules/WorkOrders/ListView/WorkOrderTabPageMetadata.js', undefined, 'sap-icon://wrench'));
            } else if (CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'Operation') {
                tabs.push(addTab('jobs', '/SAPAssetManager/Rules/SideDrawer/SideDrawerOperationsCount.js', '/SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationTabPageMetadata.js', undefined, 'sap-icon://activity-2'));
            } else if (CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'SubOperation') {
                tabs.push(addTab('jobs', '/SAPAssetManager/Rules/SideDrawer/SideDrawerSubOperationsCount.js', '/SAPAssetManager/Rules/WorkOrders/SubOperations/SubOperationsTabPageMetadata.js', undefined, 'sap-icon://activity-2'));
            }
        }

        if (IsGISEnabled(context) && selectedTabs.includes('map')) {
            tabs.push(addTab('map', '$(L,map)', undefined, '/SAPAssetManager/Pages/Extensions/Map.page', 'sap-icon://map-3'));
        }

        if (EnableTechObjectsFacet(context)) {
            if (selectedTabs.includes('flocs')) {
                tabs.push(addTab('floc', '/SAPAssetManager/Rules/FunctionalLocation/FunctionalLocationCaption.js', '/SAPAssetManager/Rules/FunctionalLocation/FunctionalLocationTabPageMetadata.js', undefined, 'sap-icon://factory'));
            }

            if (selectedTabs.includes('equipment')) {
                tabs.push(addTab('equip', '/SAPAssetManager/Rules/SideDrawer/SideDrawerEquipmentCount.js', '/SAPAssetManager/Rules/Equipment/EquipmentTabPageMetadata.js', undefined, 'sap-icon://machine'));
            }
        }

        if (IsPMNotificationEnabled(context) && selectedTabs.includes('notifications')) {
            tabs.push(addTab('notifications', '/SAPAssetManager/Rules/SideDrawer/SideDrawerNotificationsCount.js', '/SAPAssetManager/Rules/Notifications/ListView/NotificationsTabPageMetadata.js', undefined, 'sap-icon://message-warning'));
        }

        if (EnableStockLookUp(context) && selectedTabs.includes('parts')) {
            tabs.push(addTab('parts', '/SAPAssetManager/Rules/Inventory/Stock/StockTabPageCount.js', '/SAPAssetManager/Rules/Inventory/Stock/StockTabPageMetadata.js', undefined, 'sap-icon://product'));
        }

        if (selectedTabs.includes('time')) {
            if (TimeSheetsIsEnabled(context)) {
                tabs.push(addTab('time', '/SAPAssetManager/Rules/OverviewPage/TimeCaptureSection/TimeCaptureSectionTitle.js', '/SAPAssetManager/Rules/TimeSheets/TimeSheetListPageMetadata.js', undefined, 'sap-icon://time-account'));
            } else if (ConfirmationsIsEnabled(context)) {
                tabs.push(addTab('time', '/SAPAssetManager/Rules/OverviewPage/TimeCaptureSection/TimeCaptureSectionTitle.js', '/SAPAssetManager/Rules/Confirmations/OverviewListView/OverviewRowPageMetadata.js', undefined, 'sap-icon://time-account'));
            }
        }

        page.Controls.find(c => c._Type === 'Control.Type.Tabs').Items.push(...tabs);
        return Promise.resolve();
    });
}

function addTab(name, caption, pageMetadata, pageToOpen, image) {
    return {
        '_Type': 'Control.Type.TabItem',
        '_Name': name,
        'Caption': caption,
        'PageMetadata': pageMetadata || '',
        'PageToOpen': pageToOpen || '',
        'Image': image,
    };
}


