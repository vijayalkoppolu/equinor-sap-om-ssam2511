/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import CommonLibrary from '../Common/Library/CommonLibrary';
import {WORKORDER_ASSN} from '../Common/Library/AssignmentType';
export default function WorkOrderMyOperationsFilterVisible(clientAPI) {
    return CommonLibrary.isWorkOrderAssignmentTypeIncluded(clientAPI, WORKORDER_ASSN.OPERATION_WORKCENTER);
}
