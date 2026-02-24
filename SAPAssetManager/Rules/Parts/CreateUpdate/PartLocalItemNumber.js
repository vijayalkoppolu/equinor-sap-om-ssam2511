import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';

export default function PartLocalItemNumber(context) {
    let OperationLstPkrValue = libCom.getTargetPathValue(context, '#Control:OperationLstPkr/#Value') ? libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:OperationLstPkr/#Value')) : context?.binding?.OperationNo;
    let WOLstPkrValue  = libCom.getTargetPathValue(context, '#Control:Order/#Value') ? libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:Order/#Value')) : context?.binding?.OrderId;
    return GenerateLocalID(context, 'MyWorkOrderComponents', 'ItemNumber', '0000', `$filter=OrderId eq '${WOLstPkrValue}' and OperationNo eq '${OperationLstPkrValue}'`, '');
}
