import libCommon from '../../../Common/Library/CommonLibrary';
import libEval from '../../../Common/Library/ValidationLibrary';
import sdfIsFeatureEnabled from '../../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../../Forms/SDF/FormInstanceCount';
import Logger from '../../../Log/Logger';

export default function IsValidFinalConfirmation(context) {
	const binding = context.getBindingObject();

	if (binding?.OrderID && binding?.Operation) {
		const operationQueryString = binding.SubOperation
				? `MyWorkOrderSubOperations(OrderId='${binding.OrderID}',OperationNo='${binding.Operation}',SubOperationNo='${binding.SubOperation}')`
				: `MyWorkOrderOperations(OrderId='${binding.OrderID}',OperationNo='${binding.Operation}')`;

		return context.read('/SAPAssetManager/Services/AssetManager.service', `${operationQueryString}/Confirmations`, [], '')
				.then(async function(result) {
					const finalConfirmation = result._array.find(confirmation => confirmation.FinalConfirmation === 'X' && confirmation.SubOperation === binding.SubOperation);
					const hasFinalConfirmation = !libEval.evalIsEmpty(finalConfirmation);
					const isCurrentConfirmationSetAsFinal = libCommon.getControlProxy(context, 'IsFinalConfirmation').getValue();
					const isCreateConfirmation = binding.IsOnCreate;
					const checkFinalConfirmation = (hasFinalConfirmation && isCurrentConfirmationSetAsFinal && binding.ConfirmationNum !== finalConfirmation.ConfirmationNum);
					const shouldPreventConfirmation = isCreateConfirmation ? hasFinalConfirmation : checkFinalConfirmation;
					if (sdfIsFeatureEnabled(context) && isCurrentConfirmationSetAsFinal) {
						let count = await FormInstanceCount(context, true, operationQueryString)
							.catch((error) => {
								Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), error);
								return 0;
							});
						if (count > 0) {
							return context.executeAction({
								'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
								'Properties': {
									'Message': '$(L,sdf_mandatory_forms_required)',
									'OKCaption': '$(L,ok)',
								},
							}).then(function() {
								return false;
							});
						}
					}
					if (shouldPreventConfirmation) {
						return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidEntryAfterFinal.action').then(function() {
							return false;
						});
					}
					return true;
				})
				.catch(function() {
					return false;
				});
	}

	return Promise.resolve(true);
}
