import FilterSettings from './FilterSettings';
import EquipmentListFilterResults from '../Equipment/EquipmentListFilterResults';
import libCom from '../Common/Library/CommonLibrary';
import { GetConfirmationListFilterCriteria } from '../Confirmations/List/Filter/ConfirmationListFilterResults';
import ExpensesListFilterResults from '../Expenses/ExpensesListFilterResults';
import FSMFilteringResult from '../Forms/FSM/FSMFilteringResult';
import FLOCFilteringResult from '../FunctionalLocation/FLOCFilteringResult';
import { GetInventorySearchFilterCriteria } from '../Inventory/Search/InventorySearchFilterResults';
import { GetStockSearchFilterCriteria } from '../Inventory/Stock/StockSearchFilterResults';
import cachedNotificationListFilterResults from '../Notifications/NotificationListFilterResults';
import cachedServiceOrderListFilterResults from '../ServiceOrders/ListView/Filter/ServiceOrderListFilterResults';
import cachedServiceRequestListFilterResults from '../ServiceOrders/ListView/Filter/ServiceRequestListFilterResults';
import cachedServiceItemListFilterResults from '../ServiceOrders/Item/Filter/ServiceItemListFilterResults';
import SafetyCertificatesListViewFilterResults from '../WCM/SafetyCertificates/SafetyCertificatesListViewFilterResults';
import WorkApprovalsListViewFilterResults from '../WCM/WorkApprovals/List/WorkApprovalsListViewFilterResults';
import WorkPermitFilterResults from '../WCM/WorkPermitFilter/WorkPermitFilterResults';
import OperationalItemsFilterResult from '../WCM/OperationalItems/ListView/OperationalItemsFilterResult';
import cachedWorkOrderListFilterResults from '../WorkOrders/WorkOrderListFilterResults';
import { GetInspectionLotListFilterCriteria } from '../WorkOrders/InspectionLot/InspectionLotListFilterResults';
import cachedWorkOrderOperationListFilterResults from '../WorkOrders/Operations/WorkOrderOperationListFilterResults';
import cachedSubOperationsListFilterResults from '../WorkOrders/SubOperationsListFilterResults';
import ContainersSearchFilterResults from '../FL/Containers/ListView/ContainersSearchFilterResults';
import VoyagesSearchFilterResults from '../FL/Voyages/VoyagesSearchFilterResults';
import ReturnsByProductSearchFilterResults from '../FL/ReturnsByProduct/ReturnsByProductSearchFilterResults';
import WorkOrdersSearchFilterResults from '../FL/WorkOrders/ListView/WorkOrdersSearchFilterResults';
import PackagesSearchFilterResults from '../FL/Packages/ListView/PackagesSearchFilterResults';
import HUDelItemsSearchFilterResults from '../FL/HUDelItems/ListView/HUDelItemsSearchFilterResults';
import ServiceQuotationsFilterResult from '../ServiceQuotations/List/Filter/ServiceQuotationsFilterResult';
import WarehouseOrderSearchFilterResults from '../EWM/WarehouseOrder/SearchFilter/WarehouseOrderSearchFilterResults';
import WarehouseTaskSearchFilterResults from '../EWM/WarehouseTask/SearchFilter/WarehouseTaskSearchFilterResults';
import BulkEditsSearchFilterResults from '../FL/BulkUpdate/BulkEditsSearchFilterResults';
import PurchaseOrderSearchFilterResults from '../Inventory/PurchaseOrder/SearchFilter/PurchaseOrderSearchFilterResults';
import StockTransportOrderSearchFilterResults from '../Inventory/StockTransportOrder/SearchFilter/StockTransportOrderSearchFilterResults';
import ReservationSearchFilterResults from '../Inventory/Reservation/SearchFilter/ReservationSearchFilterResults';
import ProductionOrderSearchFilterResults from '../Inventory/ProductionOrder/SearchFilter/ProductionOrderSearchFilterResults';
import InboundOutboundSearchFilterResults from '../Inventory/InboundOrOutbound/InboundOutboundSearchFilterResults';
import PhysicalInventorySearchFilterResults from '../Inventory/PhysicalInventory/SearchFilter/PhysicalInventorySearchFilterResults';
import FSMS4CrewFilterResults from '../Crew/FSM/S4/FSMS4CrewFilterResults';
import PISearchFilterResults from '../EWM/PhysicalInventory/SearchFilter/PISearchFilterResults';

export default async function SaveFilterAsDefault(context) {
    const pageProxy = context.getPageProxy();  // pageProxy of the filter page
    const pageName = libCom.getPageName(pageProxy);
    let filterResults;

    switch (pageName) {
        case 'EquipmentFilterPage':
            filterResults = await EquipmentListFilterResults(pageProxy);
            break;
        case 'ConfirmationListFilterPage':
            filterResults = GetConfirmationListFilterCriteria(pageProxy);
            break;
        case 'DocumentFilterPage':
            filterResults = [context.evaluateTargetPath('#Page:DocumentFilterPage/#Control:SortFilter/#Value')];
            break;
        case 'SubEquipmentFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:SortFilter/#Value'),
                context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:StatusFilter/#Value'),
            ];
            break;
        case 'ExpensesFilterPage':
            filterResults = ExpensesListFilterResults(pageProxy);
            break;
        case 'FSMFilterPage':
            filterResults = FSMFilteringResult(pageProxy);
            break;
        case 'RouteFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:RouteFilterPage/#Control:SortFilter/#Value'),
                context.evaluateTargetPath('#Page:RouteFilterPage/#Control:MobileStatusFilter/#Value'),
            ];
            break;
        case 'FunctionalLocationFilterPage':
            filterResults = await FLOCFilteringResult(pageProxy);
            break;
        case 'InventorySearchFilterPage':
            filterResults = GetInventorySearchFilterCriteria(pageProxy);
            break;
        case 'StockSearchFilter':
            filterResults = GetStockSearchFilterCriteria(pageProxy);
            break;
        case 'MeasuringPointsListFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:SortFilter/#Value'),
                context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:CounterFilter/#Value'),
                context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:ValCodeFilter/#Value'),
            ];
            break;
        case 'NotificationFilterPage':
            filterResults = cachedNotificationListFilterResults(pageProxy);
            break;
        case 'ServiceOrderFilterPage':
            filterResults = cachedServiceOrderListFilterResults(pageProxy);
            break;
        case 'ServiceRequestFilterPage':
            filterResults = cachedServiceRequestListFilterResults(pageProxy);
            break;
        case 'ServiceItemFilterPage':
            filterResults = cachedServiceItemListFilterResults(pageProxy);
            break;
        case 'SafetyCertificatesFilterPage':
            filterResults = SafetyCertificatesListViewFilterResults(context);
            break;
        case 'WorkApprovalsFilterPage':
            filterResults = WorkApprovalsListViewFilterResults(context);
            break;
        case 'WorkPermitsFilterPage':
            filterResults = WorkPermitFilterResults(context);
            break;
        case 'OperationalItemsListFilter':
            filterResults = OperationalItemsFilterResult(context);
            break;
        case 'WorkOrderFilterPage':
            filterResults = cachedWorkOrderListFilterResults(pageProxy);
            break;
        case 'InspectionLotFilterPage':
            filterResults = GetInspectionLotListFilterCriteria(pageProxy);
            break;
        case 'WorkOrderOperationsFilterPage':
            filterResults = cachedWorkOrderOperationListFilterResults(pageProxy);
            break;
        case 'PRTDocumentFilterPage':
            filterResults = [context.evaluateTargetPath('#Page:PRTDocumentFilterPage/#Control:SortFilter/#Value')];
            break;
        case 'SubOperationsFilterPage':
            filterResults = cachedSubOperationsListFilterResults(pageProxy);
            break;
        case 'VoyagesSearchFilter':
            filterResults = VoyagesSearchFilterResults(pageProxy);
            break;
        case 'FLWorkOrdersFilterPage':
            filterResults = WorkOrdersSearchFilterResults(pageProxy);
            break;
        case 'FLReturnsByProductFilterPage':
            filterResults = ReturnsByProductSearchFilterResults(pageProxy);
            break;
        case 'HUDelItemsFilterPage':
            filterResults = HUDelItemsSearchFilterResults(pageProxy);
            break;
        case 'ContainersSearchFilterPage':
            filterResults = ContainersSearchFilterResults(pageProxy);
            break;
        case 'PackagesSearchFilterPage':
            filterResults = PackagesSearchFilterResults(pageProxy);
            break;
        case 'ServiceQuotationsFilterPage':
        case 'ServiceQuotationItemsFilterPage':
            filterResults = ServiceQuotationsFilterResult(pageProxy);
            break;
        case 'WarehouseOrderSearchFilterPage':
            filterResults = WarehouseOrderSearchFilterResults(pageProxy);
            break;
        case 'WarehouseTaskSearchFilterPage':
            filterResults = WarehouseTaskSearchFilterResults(pageProxy);
            break;
        case 'BulkFLEditFilterPage':
            filterResults = BulkEditsSearchFilterResults(pageProxy);
            break;
        case 'PurchaseOrderSearchFilterPage':
            filterResults = PurchaseOrderSearchFilterResults(pageProxy);
            break;
        case 'StockTransportOrderSearchFilterPage':
            filterResults = StockTransportOrderSearchFilterResults(pageProxy);
            break;
        case 'ReservationSearchFilterPage':
            filterResults = ReservationSearchFilterResults(pageProxy);
            break;
        case 'ProductionOrderSearchFilterPage':
            filterResults = ProductionOrderSearchFilterResults(pageProxy);
            break;
        case 'InboundSearchFilterPage':
        // drop down
        // eslint-disable-next-line no-fallthrough
        case 'OutboundSearchFilterPage':
            filterResults = InboundOutboundSearchFilterResults(pageProxy);
            break;
        case 'PhysicalInventorySearchFilterPage':
            filterResults = PhysicalInventorySearchFilterResults(pageProxy);
            break;
        case 'WHPhysicalInventorySearchFilterPage':
            filterResults = PISearchFilterResults(pageProxy);
            break;
        case 'FSMS4CrewFilterPage':
            filterResults = FSMS4CrewFilterResults(pageProxy);
            break;
            default:
            filterResults = [];
    }

    await FilterSettings.onSettingsSave(context, filterResults);
}
