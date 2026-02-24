import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function EditItemTableOnRendered(context, page = context.getPageProxy(), binding = page.binding || context.binding) {
  if (!binding || !(binding.hasErrors && binding._ErrorMessage)) {
    return;
  }

  const table = page.getControl('EditInboundDeliveryTable');
  const form = table?.getSection?.('FormCellSection');
  if (!form) {
    return;
  }

  const reason = binding._ErrorReason || '';
  const qtyCtrl = form.getControl?.('QuantityInput');
  const batchCtrl = form.getControl?.('Batch');

  let ctrl = null;

  if (reason === 'MissingBatch') {
    ctrl = batchCtrl || qtyCtrl;
  } else if (reason === 'MissingSerials') {
    ctrl = qtyCtrl;
  } else {
    ctrl = qtyCtrl || batchCtrl;
  }

  if (!ctrl) {
    return;
  }

  CommonLibrary.executeInlineControlError(context, ctrl, binding._ErrorMessage);
  ctrl.clearValidationOnValueChange?.(true);

  context.executeAction({
    Name: '/SAPAssetManager/Actions/Common/ErrorBannerMessage.action',
    Properties: {
      Message: binding._ErrorMessage,
      Duration: 4,
      Animated: true,
      _Type: 'Action.Type.BannerMessage',
    },
  });
}
