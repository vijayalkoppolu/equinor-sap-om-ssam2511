import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* Set the Caption, and Operation and AssignTo ListPickers on the OperationAssignment Page.  Navigation to 
* OperationList screen may have been called from Sidebar or Overview screens, so bound object may not exist 
* or have OperationNo or PersonNum properties.
*
* @param {IClientAPI} context
*/
export default function OperationAssignOnLoad(context) {
    try {
        if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            let operationListPicker = context.evaluateTargetPathForAPI('#Control:OperationLstPkr');
            let operationSpecifier = operationListPicker.getTargetSpecifier();
            operationSpecifier.setQueryOptions(`$filter=PersonNum eq '00000000' and OrderId eq '${context.binding.OrderId}'&$orderby=OperationNo asc`);
            operationListPicker.setTargetSpecifier(operationSpecifier);
        }
        
        const IsUnAssign = libCom.getStateVariable(context, 'IsUnAssign');
        const IsReAssign = libCom.getStateVariable(context, 'IsReAssign');
        const IsAssign = libCom.getStateVariable(context, 'IsAssign');
        const operationNo = context.binding?.OperationNo;
        const personNum = context.binding?.PersonNum;

        if (!libVal.evalIsEmpty(IsUnAssign) && IsUnAssign && !libVal.evalIsEmpty(operationNo) && !libVal.evalIsEmpty(personNum)) {
            context.setCaption(context.localizeText('operation_unassign', [operationNo]));
            if (!(libVal.evalIsEmpty(context.binding.Employee_Nav)) || personNum !== '00000000') {
                let assignToLstPkr = context.getControl('FormCellContainer').getControl('AssignToLstPkr');
                assignToLstPkr.setValue(personNum);
                assignToLstPkr.setEditable(false);
            }
        } else if (!libVal.evalIsEmpty(IsAssign) && IsAssign && !libVal.evalIsEmpty(operationNo)) {
            context.setCaption(context.localizeText('operation_assign', [operationNo]));
        } else if (!libVal.evalIsEmpty(IsReAssign) && IsReAssign && !libVal.evalIsEmpty(operationNo) && !libVal.evalIsEmpty(personNum)) {
            context.setCaption(context.localizeText('workorder_reassign', [operationNo]));
            if (!(libVal.evalIsEmpty(context.binding.Employee_Nav)) || personNum !== '00000000') {
                let assignToLstPkr = context.getControl('FormCellContainer').getControl('AssignToLstPkr');
                assignToLstPkr.setValue(personNum);
                assignToLstPkr.setEditable(true);
                context.getClientData().PreviousEmployeeTo = personNum;
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', [] ,`$filter=PersonnelNo eq '${personNum}'`).then(function(userresults) {
                    if (userresults && userresults.length > 0) {
                        context.getClientData().PreviousEmployeeName=userresults.getItem(0).SAPUserId + ' - ' + userresults.getItem(0).UserNameLong;
                    }
                });
            }
        }
    } catch (error) {
        context.setCaption(context.localizeText('operations_assign'));
    }
}
