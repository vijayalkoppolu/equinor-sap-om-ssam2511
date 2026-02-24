/**
 * Constructs the filter query for flocs to show only those associated with the user's work orders, operations, or sub-operations.
 * @returns {string} - The constructed filter query string.
 * @param {IClientAPI} clientAPI
*/
import libCom from '../Common/Library/CommonLibrary';
import { getMyWorkOrdersFilterQuery } from '../WorkOrders/WorkOrderMyWorkordersFilter';
import { getMyOperationsFilterQuery } from '../WorkOrders/WorkOrderMyOperationsFilter';

export default function GetMyEquipFlocFilterQuery(context) {
    let retValue = '';
    if (libCom.getWorkOrderAssnTypeLevel(context) === 'Header') {
        // Filter for equipment/floc associated with orders
        let myOrdersFilter = getMyWorkOrdersFilterQuery(context, 'wo');
        retValue += 'WorkOrderHeader/any(wo: (' + myOrdersFilter + '))';
        retValue += ' or ';
        // Filter for equipment/floc associated with operations
        let myOrdersOpFilter = getMyWorkOrdersFilterQuery(context, 'op/WOHeader');
        retValue += 'WorkOrderOperation/any(op: (' + myOrdersOpFilter + '))';
        retValue += ' or ';
        // Filter for equipment/floc associated with suboperations
        let myOrdersOpSubOpFilter = getMyWorkOrdersFilterQuery(context, 'sop/WorkOrderOperation/WOHeader');
        retValue += 'WorkOrderSubOperation/any(sop: (' + myOrdersOpSubOpFilter + '))';
    } else if (libCom.getWorkOrderAssnTypeLevel(context) === 'Operation') {
        // Filter for equipment/floc associated with operations
        let myOperationsFilter = getMyOperationsFilterQuery(context, 'op');
        retValue += 'WorkOrderOperation/any(op: (' + myOperationsFilter + '))';

        retValue += ' or ';
        // Filter for equipment/floc associated with suboperations
        let myOpSubOpFilter = getMyOperationsFilterQuery(context, 'sop/WorkOrderOperation');
        retValue += 'WorkOrderSubOperation/any(sop: (' + myOpSubOpFilter + '))';
    } else if (libCom.getWorkOrderAssnTypeLevel(context) === 'SubOperation') {
        // Filter for equipment/floc associated with suboperations
        let mySubOpFilter = 'sop/SubOpMobileStatus_Nav/CreateUserGUID eq \'' + libCom.getUserGuid(context) + '\'';
        retValue += 'WorkOrderSubOperation/any(sop: (' + mySubOpFilter + '))';
    } 
    return retValue;
}
