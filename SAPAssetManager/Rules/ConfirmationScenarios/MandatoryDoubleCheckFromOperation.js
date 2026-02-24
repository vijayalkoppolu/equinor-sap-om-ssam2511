import libConfirm from './ConfirmationScenariosLibrary';

/**
 * Display Yes/No for mandatory double check based on operation/suboperation
 * @param {*} context 
 * @returns 
 */
export default async function MandatoryDoubleCheckFromOperation(context) {
    let binding = context.getBindingObject();
    let result = false;

    if (binding.OrderId && binding.OperationNo) {
        result = await libConfirm.getMandatoryDoubleCheck(context, binding.OrderId, binding.OperationNo, binding.SubOperationNo);
    }

    if (result) return context.localizeText('yes');
    return context.localizeText('no');
}
