import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default async function OnEditItemReturning(context, page = context.getPageProxy(), binding = page.binding || context.binding) {

  if (!binding) return;

  const shouldReset = libCom.getStateVariable(context, 'ResetQtyDueToUOM');
  if (shouldReset) {
    const table = page.getControl('EditInboundDeliveryTable');
    const formSection = table?.getSection('FormCellSection');
    const qty = formSection?.getControl('QuantityInput');
    qty?.setValue?.('');

    libCom.removeStateVariable(context, 'ResetQtyDueToUOM');
  }

  if (binding.Serialized === 'X') {
    const expected = Number(binding.Quantity) || 0;
    const docId = binding.DocumentID ?? binding.documentID;
    const itemId = binding.ItemID;

    try {
      const actualCount = await context.count(
        '/SAPAssetManager/Services/AssetManager.service',
        'WarehouseInboundDeliveryItemSerials',
        `$filter=DocumentID eq '${docId}' and ItemID eq '${itemId}'`,
      );

      if (actualCount === expected) {
        binding.hasErrors = false;
        binding._ErrorReason = null;
        binding._ErrorMessage = null;

        const table = page.getControl('EditInboundDeliveryTable');
        const form = table?.getSection('FormCellSection');
        const qtyCtrl = form?.getControl('QuantityInput');
        qtyCtrl?.clearValidation?.();
        qtyCtrl?.clearValidationOnValueChange?.(false);

        table?.getSection('SerialManagementSection')?.getControl('ManageSerialsButton')?.clearValidation?.();
      }
    } catch (error) {
      Logger.error('EditItemOnReturning', error);
    }
  }
}
