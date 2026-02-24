import CommonLibrary from '../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../SideDrawer/EnableMultipleTechnician';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsSupervisorEnableWorkOrderEdit from '../Supervisor/SupervisorRole/IsSupervisorEnableWorkOrderEdit';
import IsWorkOrderAllowedToCreateUpdate from '../WorkOrders/CreateUpdate/IsWorkOrderAllowedToCreateUpdate';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import SubOperationCreateNav from '../SubOperations/CreateUpdate/SubOperationCreateNav';
import PartCreateNav from '../Parts/CreateUpdate/PartCreateNav';
import AssignmentType from '../Common/Library/AssignmentType';
import PartIssueNav from '../Parts/Issue/PartIssueNav';
import SubOperationsListViewNav from '../WorkOrders/SubOperations/SubOperationsListViewNav';
import ManageDeepLink from './ManageDeepLink';
import WorkOrdersListViewNav from '../WorkOrders/WorkOrdersListViewNav';
import WorkOrderCreateNav from '../WorkOrders/CreateUpdate/WorkOrderCreateNav';
import WorkOrderOperationCreateNav from '../WorkOrders/Operations/CreateUpdate/WorkOrderOperationCreateNav';
import OperationsListViewNav from '../WorkOrders/Operations/OperationsListViewNav';
import NotificationCreateChangeSetNav from '../Notifications/CreateUpdate/NotificationCreateChangeSetNav';
import TimeSheetEntryCreateNav from '../TimeSheets/Entry/CreateUpdate/TimeSheetEntryCreateNav';
import ConfirmationCreateUpdateNav from '../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import SubOperationsListViewQueryOption from '../SubOperations/SubOperationsListViewQueryOption';
import IsSubOperationLevelAssigmentType from '../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsOperationLevelAssigmentType from '../WorkOrders/Operations/IsOperationLevelAssigmentType';
import EnableNotificationEdit from '../UserAuthorizations/Notifications/EnableNotificationEdit';
import PartEditEnable from '../Parts/PartEditEnable';
import { WorkOrderLibrary } from '../WorkOrders/WorkOrderLibrary';
import { EquipmentLibrary } from '../Equipment/EquipmentLibrary';
import { OperationConstants } from '../WorkOrders/Operations/WorkOrderOperationLibrary';
import NotificationDetailsNavQueryOptions from '../Notifications/Details/NotificationDetailsNavQueryOptions';
import IsAndroid from '../Common/IsAndroid';
import { WorkOrderDetailsPageName } from '../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import { SubOperationDetailsPageName } from '../SubOperations/SubOperationDetailsPageToOpen';
import { NotificationDetailsPageName } from '../Notifications/Details/NotificationDetailsPageToOpen';
import { WorkOrderOperationDetailsPageNameToOpen } from '../WorkOrders/Operations/Details/WorkOrderOperationDetailsPageToOpen';
import ConfirmationCreateIsEnabled from '../Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';
import TimeSheetCreateIsEnabled from '../TimeSheets/TimeSheetCreateIsEnabled';

export default class DeepLinkLibrary {
    static CreateIssuePartAllowed(context) {
        return EnableMultipleTechnician(context)
            && CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Parts.Issue') === 'Y';
    }

    static CreateNotificationAllowed(context) {
        return EnableMultipleTechnician(context) && EnableNotificationCreate(context);
    }

    static CreateOperationAllowed(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId) {
            return EnableMultipleTechnician(context) && IsSupervisorEnableWorkOrderEdit(context);
        }
        return EnableMultipleTechnician(context) && IsSupervisorEnableWorkOrderEdit(context)
            && CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'Operation';
    }

    static CreateTimesheetAllowed(context) {
        return EnableMultipleTechnician(context) && TimeSheetCreateIsEnabled(context);
    }

    static CreateWorkOrderAllowed(context) {
        return EnableMultipleTechnician(context) && IsWorkOrderAllowedToCreateUpdate(context);
    }

    static CreateSubOperationAllowed(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId && parameters.OperationNo) {
            return EnableMultipleTechnician(context) && EnableWorkOrderEdit(context);
        }

        return EnableMultipleTechnician(context) && EnableWorkOrderEdit(context)
            && CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'SubOperation';
    }

    static CreateConfirmationAllowed(context) {
        return EnableMultipleTechnician(context) && ConfirmationCreateIsEnabled(context);
    }

    static async CreateWorkOrderNav(context) {
        await ManageDeepLink.getInstance().getActionBindingWithParameters(context);
        ManageDeepLink.getInstance().setObjectVariables(context);
        return DeepLinkLibrary.ViewWorkOrderNav(context).then(() => {
            return CommonLibrary.sleep(200).then(() => WorkOrderCreateNav(context.currentPage.context.clientAPI));
        });
    }

    static async CreateOperationNav(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId) {
            let queryOptions = `$filter=OrderId eq '${parameters.OrderId}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], queryOptions)
                .then(async function(result) {
                    if (result.length) {
                        if (parameters.OperationShortText) {
                            parameters.OrderDescription = parameters.OperationShortText;
                        }
                        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, result.getItem(0));
                        ManageDeepLink.getInstance().setObjectVariables(context);
                        return DeepLinkLibrary.ViewWorkOrderNav(context, true, result.getItem(0)['@odata.id']).then(() => {
                            return WorkOrderOperationCreateNav(context);
                        });
                    }
                    return Promise.reject({ 'key': 'deep_link_invalid_action' });
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        ManageDeepLink.getInstance().setObjectVariables(context);
        return DeepLinkLibrary.ViewOperationNav(context).then(() => {
            return WorkOrderOperationCreateNav(context);
        });
    }

    static async CreateSubOperationNav(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId && parameters.OperationNo) {
            let queryOptions = `$filter=OrderId eq '${parameters.OrderId}' and OperationNo eq '${parameters.OperationNo}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], queryOptions)
                .then(async function(result) {
                    if (result.length) {
                        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, result.getItem(0));
                        return DeepLinkLibrary.ViewOperationNav(context, true, result.getItem(0)['@odata.id']).then(() => {
                            return SubOperationCreateNav(context);
                        });
                    }
                    return Promise.reject({ 'key': 'deep_link_invalid_action' });
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }
        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return DeepLinkLibrary.ViewSubOperationNav(context).then(() => {
            return SubOperationCreateNav(context);
        });
    }

    static CreateNotificationNav(context) {
        return DeepLinkLibrary.ViewNotificationNav(context).then(() => {
            setTimeout(async () => {
                let binding = await ManageDeepLink.getInstance().getActionBindingWithParameters(context);
                return NotificationCreateChangeSetNav(context.currentPage.context.clientAPI, binding);
            }, IsAndroid(context) ? 0 : 300);
        });
    }

    static async CreateTimeSheetNav(context) {
        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, undefined, ['OrderId']);
        ManageDeepLink.getInstance().setObjectVariables(context);
        return DeepLinkLibrary._navigateToListScreen(context, '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntriesListViewNav.action', 'TimeSheetsListViewPage').then(() => {
            return TimeSheetEntryCreateNav(context);
        });
    }

    static async CreateConfirmationNav(context) {
        const binding = await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, { 'IsOnCreate': true });
        return DeepLinkLibrary._navigateToListScreen(context, '/SAPAssetManager/Actions/Confirmations/ConfirmationsOverviewListViewNav.action', 'ConfirmationsOverviewListView').then(() => {
            return ConfirmationCreateUpdateNav(context, binding);
        });
    }

    static CreatePartNav(context) {
        CommonLibrary.setOnCreateUpdateFlag(context, '');
        return DeepLinkLibrary._navigateToListScreen(context, '/SAPAssetManager/Actions/Parts/PartsListViewNav.action', 'PartsListViewPage').then(async () => {
            CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
            await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, { 'ItemCategory': '' });
            return PartCreateNav(context);
        });
    }

    static async CreateIssuePartNav(context) {
        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, { 'ItemCategory': '' });
        return DeepLinkLibrary._navigateToListScreen(context, '/SAPAssetManager/Actions/Parts/PartsListViewNav.action', 'PartsListViewPage').then(() => {
            return PartIssueNav(context);
        });
    }

    static SetWorkOrderVariables(context, parameters) {
        if (parameters) {
            if (parameters.PlanningPlant) {
                CommonLibrary.setStateVariable(context, 'WODefaultPlanningPlant', parameters.PlanningPlant);
            }
            if (parameters.MainWorkCenterPlant) {
                CommonLibrary.setStateVariable(context, 'WODefaultWorkCenterPlant', parameters.MainWorkCenterPlant);
            }
            if (parameters.MainWorkCenter) {
                CommonLibrary.setStateVariable(context, 'WODefaultMainWorkCenter', parameters.MainWorkCenter);
            }
        }
    }

    static SetSubOperationVariables(context, parameters) {
        if (context && parameters) {
            let values = {
                'type': 'WorkOrderSubOperation',
            };

            if (parameters.MainWorkCenterPlant) {
                values.WorkCenterPlant = {
                    'default': parameters.MainWorkCenterPlant,
                };
            }
            if (parameters.MainWorkCenter) {
                values.MainWorkCenter = {
                    'default': parameters.MainWorkCenter,
                };
            }

            AssignmentType.setWorkOrderAssignmentDefaults(values);
        }
    }

    static SetOperationVariables(context, parameters) {
        CommonLibrary.removeStateVariable(context, 'WorkOrder');

        if (parameters) {
            let values = {
                'type': 'WorkOrderOperation',
            };

            if (parameters.MainWorkCenterPlant) {
                values.WorkCenterPlant = {
                    'default': parameters.MainWorkCenterPlant,
                };
            }
            if (parameters.MainWorkCenter) {
                values.MainWorkCenter = {
                    'default': parameters.MainWorkCenter,
                };
            }

            AssignmentType.setWorkOrderAssignmentDefaults(values);
        }
    }

    static SetTimesheetVariables(context, parameters) {
        if (context && parameters) {
            if (parameters.OrderId) {
                CommonLibrary.setStateVariable(context, 'OrderId', parameters.OrderId);
            }
            if (parameters.ActivityType) {
                CommonLibrary.setStateVariable(context, 'ActivityType', parameters.ActivityType);
            }
            if (parameters.AttendanceType) {
                CommonLibrary.setStateVariable(context, 'AttendanceType', parameters.AttendanceType);
            }
        }
    }

    static ViewWorkOrderNav(context, isDetailsView, entityId) {
        if (isDetailsView) {
            return DeepLinkLibrary._navigateToDetailsScreen(context, '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action', WorkOrderDetailsPageName(context), entityId);
        }

        return DeepLinkLibrary._navigateToListScreen(context, WorkOrdersListViewNav, 'WorkOrdersListViewPage');
    }

    static SetWorkOrderQueryOptions(context) {
        return WorkOrderLibrary.getWorkOrderDetailsNavQueryOption(context);
    }

    static async ViewOperationNav(context, isDetailsView, entityId) {
        if (isDetailsView) {
            return DeepLinkLibrary._navigateToDetailsScreen(context, '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action', WorkOrderOperationDetailsPageNameToOpen(context), entityId);
        }

        if (DeepLinkLibrary.ViewOperationAllowed(context)) {
            await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
            return DeepLinkLibrary._navigateToListScreen(context, OperationsListViewNav, 'WorkOrderOperationsListViewPage');
        }

        return Promise.reject({'key': 'deep_link_invalid_action'});
    }

    static SetOperationQueryOptions(context) {
        return OperationConstants.FromWOrkOrderOperationListQueryOptions(context, false);
    }

    static async ViewSubOperationNav(context, isDetailsView, entityId) {
        if (isDetailsView) {
            return DeepLinkLibrary._navigateToDetailsScreen(context, '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationDetailsNav.action', SubOperationDetailsPageName(context), entityId);
        }

        if (DeepLinkLibrary.ViewSubOperationAllowed(context)) {
            await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
            return DeepLinkLibrary._navigateToListScreen(context, SubOperationsListViewNav, 'SubOperationsListViewPage');
        }
      
        return Promise.reject({'key': 'deep_link_invalid_action'});
    }

    static SetSubOperationsQueryOptions(context) {
        return SubOperationsListViewQueryOption(context);
    }

    static async ViewNotificationNav(context, isDetailsView, entityId) {
        if (isDetailsView) {
            return DeepLinkLibrary._navigateToDetailsScreen(context, '/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action', NotificationDetailsPageName(context), entityId);
        }
        CommonLibrary.setStateVariable(context, 'OnFollowOnNotificationsList', false);
        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return DeepLinkLibrary._navigateToListScreen(context, '/SAPAssetManager/Actions/Notifications/NotificationsListViewNav.action', 'NotificationsListViewPage');
    }

    static SetNotificationQueryOptions(context) {
        return NotificationDetailsNavQueryOptions(context);
    }

    static async ViewFunctionalLocationNav(context, isDetailsView, entityId) {
        if (isDetailsView) {
            return DeepLinkLibrary._navigateToDetailsScreen(context, '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action', 'FunctionalLocationDetails', entityId);
        }
        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return DeepLinkLibrary._navigateToListScreen(context, '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationsListViewNav.action', 'FunctionalLocationListViewPage');
    }

    static async ViewEquipmentNav(context, isDetailsView, entityId) {
        if (isDetailsView) {
            return DeepLinkLibrary._navigateToDetailsScreen(context, '/SAPAssetManager/Actions/Equipment/EquipmentDetailsNav.action', 'EquipmentDetailsPage', entityId);
        }
        await ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return DeepLinkLibrary._navigateToListScreen(context, '/SAPAssetManager/Actions/Equipment/EquipmentListViewNav.action', 'EquipmentListViewPage');
    }

    static SetEquipmentQueryOptions() {
        return EquipmentLibrary.equipmentDetailsQueryOptions();
    }

    static ViewActionAllowed(context) {
        return EnableMultipleTechnician(context);
    }

    static ViewSubOperationAllowed(context) {
        return IsSubOperationLevelAssigmentType(context);
    }

    static ViewOperationAllowed(context) {
        return IsOperationLevelAssigmentType(context);
    }

    static UpdateWorkOrderNav(context, entityId) {
        WorkOrderLibrary.removeFollowUpFlagPage(context);
        CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
        ManageDeepLink.getInstance().setObjectVariables(context);
        DeepLinkLibrary._navigateToDetailsScreen(context, {
            'Name': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action',
            },
        }, WorkOrderDetailsPageName(context), entityId);
    }

    static UpdateWorkOrderAllowed(context, binding) {
        return EnableWorkOrderEdit(context, binding);
    }

    static UpdateOperationNav(context, entityId) {
        CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
        ManageDeepLink.getInstance().setObjectVariables(context);
        DeepLinkLibrary._navigateToDetailsScreen(context, {
            'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action',
            },
        }, WorkOrderOperationDetailsPageNameToOpen(context), entityId);
    }

    static UpdateSubOperationNav(context, entityId) {
        CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
        ManageDeepLink.getInstance().setObjectVariables(context);
        DeepLinkLibrary._navigateToDetailsScreen(context, {
            'Name': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationCreateUpdateNav.action',
            },
        }, SubOperationDetailsPageName(context), entityId);
    }

    static UpdateNotificationNav(context, entityId) {
        DeepLinkLibrary._navigateToDetailsScreen(context, {
            'Name': '/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/Notifications/NotificationUpdateNav.js',
            },
        }, NotificationDetailsPageName(context), entityId);
    }

    static UpdateNotificationAllowed(context, binding) {
        return EnableNotificationEdit(context, binding);
    }

    static UpdateCatsTimesheetNav(context, entityId) {
        ManageDeepLink.getInstance().setObjectVariables(context);
        DeepLinkLibrary._navigateToDetailsScreen(context, {
            'Name': '/SAPAssetManager/Actions/TimeSheets/TimeEntryViewNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/TimeSheets/TimeSheetEntryEditNav.js',
            },
        }, 'TimeEntryViewPage', entityId);
    }

    static UpdateConfirmationNav(context, entityId) {
        DeepLinkLibrary._navigateToDetailsScreen(context, {
            'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationUpdateNav.js',
            },
        }, 'ConfirmationDetailsPage', entityId);
    }

    static UpdatePartAllowed(context, binding) {
        return PartEditEnable(context, binding);
    }

    static UpdatePartNav(context, entityId) {
        DeepLinkLibrary._navigateToDetailsScreen(context, {
            'Name': '/SAPAssetManager/Actions/Parts/PartDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/Parts/PartUpdateNav.js',
            },
        }, 'PartDetailsPage', entityId);
    }

    static _navigateToListScreen(context, navAction, requiredPageName) {
        if (CommonLibrary.getPageName(context) !== requiredPageName) {
            return typeof navAction === 'function' ? navAction(context) : context.executeAction(navAction);
        } else {
            // already on the required screen
            return Promise.resolve();
        }
    }

    static _navigateToDetailsScreen(context, navAction, requiredPageName, entityId) {
        let binding = context.binding || {};
        if (CommonLibrary.getPageName(context) !== requiredPageName || !entityId || binding['@odata.id'] !== entityId) {
            const actionAfterNavigation = navAction?.Properties?.OnSuccess;
            if (actionAfterNavigation) {
                return context.executeAction(navAction.Name).then(async () => {
                    await CommonLibrary.sleep(1000);
                    return context.currentPage.context.clientAPI.executeAction(actionAfterNavigation);
                });
            } else {
                return typeof navAction === 'function' ? navAction(context) : context.executeAction(navAction);
            }
        } else {
            if (typeof navAction === 'object' && navAction.Properties && navAction.Properties.OnSuccess) {
                return context.executeAction(navAction.Properties.OnSuccess);
            }

            // already on the required screen
            return Promise.resolve();
        }
    }
}
