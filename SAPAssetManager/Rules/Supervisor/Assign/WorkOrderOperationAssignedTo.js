import { GetEmployeeByNumber } from '../GetEmployeeByNumber';

export default function WorkOrderOperationAssignedTo(context) {
    let binding = context.binding;
    
    if (binding.Employee_Nav) {
        return Promise.resolve(binding.Employee_Nav.EmployeeName);
    } else if (binding.PersonNum && binding.PersonNum !== '00000000') {
        return Promise.resolve(GetEmployeeByNumber(binding.PersonNum, context));
    }
    
    return Promise.resolve(context.localizeText('unassigned'));
}
