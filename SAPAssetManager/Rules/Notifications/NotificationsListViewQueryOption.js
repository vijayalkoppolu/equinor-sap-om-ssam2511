import libVal from '../Common/Library/ValidationLibrary';
import libPersona from '../Persona/PersonaLibrary';
import phaseModel from '../Common/IsPhaseModelEnabled';
import phaseModelExpands from '../PhaseModel/PhaseModelListViewQueryOptionExpand';
import notificationsListGetTypesQueryOption from './ListView/NotificationsListGetTypesQueryOption';
import libCommon from '../Common/Library/CommonLibrary';
import NotificationListSetCaption from './ListView/NotificationListSetCaption';
import { WorkOrderDetailsPageName } from '../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import FilterLibrary from '../Filter/FilterLibrary';

/**
 * Get the query options needed for the notifications list
 * @param {*} context 
 * @param {*} useCaseIndicator - Optional string to handle special filtering, e.g., when called from releated notifications use case
 * @returns 
 */
export default async function NotificationsListViewQueryOption(context, useCaseIndicator = '') {
    let ignoreFilter = false;
    let pageName = libCommon.getPageName(context);

    let typesQueryOption = await notificationsListGetTypesQueryOption(context);
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('Effect_Nav,WorkOrder,NotifPriority,NotifMobileStatus_Nav,NotifDocuments,NotifDocuments/Document,HeaderLongText,FunctionalLocation,Equipment,NotifMobileStatus_Nav/OverallStatusCfg_Nav,Tasks,Activities,Items,Items/ItemActivities,Items/ItemCauses,Items/ItemTasks');
    queryBuilder.orderBy('Priority','NotificationNumber');
    if (phaseModel(context)) {
        let phaseModelNavlinks = phaseModelExpands('QMI');
        queryBuilder.expand(phaseModelNavlinks);
    }

    if (context.searchString) {
        queryBuilder.filter(getSearchQuery(context, context.searchString.toLowerCase()));
    }

    if (pageName === WorkOrderDetailsPageName(context) || useCaseIndicator === 'RelatedNotification') {
        ignoreFilter = true; //ignore extra filtering from work order details for notif singleton
        queryBuilder.filter(`NotificationNumber eq '${context.binding.NotificationNumber}'`);
    }

    if (!ignoreFilter) {
        if (pageName.includes('NotificationsListViewPage')) {
            NotificationListSetCaption(context.getPageProxy(), true);
            FilterLibrary.setFilterActionItemText(context, context.evaluateTargetPath(`#Page:${pageName}`), context);
        }

        if (libPersona.isFieldServiceTechnician(context) && typesQueryOption) {
            queryBuilder.filter(typesQueryOption);
        }
        if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
            queryBuilder.orderBy('Priority');
            queryBuilder.filter(`HeaderEquipment eq '${context.binding.EquipId}'`);
        } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
            queryBuilder.filter(`Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}' and itm/InspectionChar_Nav/InspectionNode eq '${context.binding.InspectionNode}' and itm/InspectionChar_Nav/InspectionChar eq '${context.binding.InspectionChar}' and itm/InspectionChar_Nav/SampleNum eq '${context.binding.SampleNum}')`);
        } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            queryBuilder.filter('ReferenceType ne "X"');
        }
    }
    return queryBuilder;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['NotificationNumber', 'NotificationDescription'];
        ModifyListViewSearchCriteria(context, 'MyNotificationHeader', searchByProperties);

        searchQuery = libCommon.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
