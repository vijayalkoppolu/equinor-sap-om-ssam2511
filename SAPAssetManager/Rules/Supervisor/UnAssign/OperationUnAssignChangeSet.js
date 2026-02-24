import { GlobalVar } from '../../Common/Library/GlobalCommon';
import libVal from '../../Common/Library/ValidationLibrary';

export default function OperationUnAssignChangeSet(context) {
    if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        if (!(libVal.evalIsEmpty(context.binding.Employee_Nav)) || context.binding.PersonNum !== '00000000') {
            const clientData = context.getPageProxy().getClientData();
            clientData.OrderId = context.binding.OrderId;
            clientData.OperationNo = context.binding.OperationNo;
            clientData.EmployeeFrom = '';
            clientData.EmployeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
            clientData.HeaderNotes = context.evaluateTargetPath('#Control:TransferNote/#Value');
            clientData.ObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
            clientData.ObjectKey = context.binding.OperationMobileStatus_Nav.ObjectKey;
            clientData.MobileStatusReadLink = context.binding.OperationMobileStatus_Nav['@odata.readLink'];
            clientData.OperationReadLink = context.binding['@odata.readLink'];
            clientData.EmployeeReadLink = `Employees('${clientData.EmployeeTo}')`;
            clientData.Ignore = 'true';
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkOrderTransfers', [], `$filter=OrderId eq '${context.binding.OrderId}' and OperationNo eq '${context.binding.OperationNo}' and EmployeeTo eq '${clientData.EmployeeTo}' and sap.hasPendingChanges()`).then(function(results) {
                if (results && results.length > 0) {
                    clientData.TransferReadLink = results.getItem(0)['@odata.readLink'];
                    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationUpdateEmptyPerson.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Supervisor/UnAssign/WorkOrderUnAssignPerson.action').then(() => {
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/UnAssign/OperationUnAssignSuccessMessage.action');
                        });
                    });
                }
                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationUpdateEmptyPerson.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Supervisor/UnAssign/OperationUnAssignSuccessMessage.action');
                });
            });
        }
    } else {
        return Promise.resolve();
    }
}
