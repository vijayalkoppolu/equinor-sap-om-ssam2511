import { ValidateSerialQuantity } from './SerialNumber/IBDSerialNumberLib';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';


export default async function OnPressSingleEditDoneButton(context, pageProxy = (context.getPageProxy?.() || context), binding = pageProxy.binding) {
  const formCellSection = pageProxy.getControl('EditInboundDeliveryTable');
  const quantityCtrl = formCellSection.getControl('QuantityInput');
  const uomCtrl = formCellSection.getControl('UOM');
  const stockCtrl = formCellSection.getControl('StockType');
  const batchCtrl = formCellSection.getControl('Batch');

  const rawQuantity = quantityCtrl.getValue();
  const quantity = Number(rawQuantity);
  const packedQty = Number(binding.PackedQuantity || 0);
  const uom = uomCtrl.getValue()?.[0]?.ReturnValue ?? '';
  const stockType = stockCtrl.getValue()?.[0]?.ReturnValue ?? '';
  const batch = batchCtrl.getValue()?.[0]?.ReturnValue ?? '';

  if (quantity < packedQty || libVal.evalIsEmpty(rawQuantity)) {
    return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/Validation/QuantityErrorMessage.action');
  }

  const quantityChanged = quantity !== Number(binding.Quantity || 0);
  const uomChanged = uom !== (binding.UnitofMeasure || '');
  const stockTypeChanged = stockType !== (binding.StockType || '');
  const batchChanged = (binding.BatchManaged ? (batch !== (binding.BatchNumber || '')) : false);
  const serialsChanged = !!CommonLibrary.getStateVariable(context, 'IBDSerialsChanged');
  const anyHeaderChange = quantityChanged || uomChanged || stockTypeChanged || batchChanged;

  if ((!binding.Serialized && !anyHeaderChange) || (binding.Serialized && !anyHeaderChange && !serialsChanged)) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
  }

    if (binding.Serialized) {
        return ValidateSerialQuantity(context).then(isValid => {
        if (!isValid) {
            CommonLibrary.executeInlineControlError(context, quantityCtrl, context.localizeText('accept_all_error'));
            return Promise.reject();
        } else {
            return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/IBDSaveEditSingleItemCS.action');
        }
        });
    } else if (binding.BatchManaged && libVal.evalIsEmpty(batch)) {
        CommonLibrary.executeInlineControlError(context, batchCtrl, context.localizeText('ewm_batch_number_missing'));
        return Promise.reject();
    } else {
        return context.executeAction('/SAPAssetManager/Rules/EWM/InboundDelivery/SingleEdit/SaveInboundItem.js');
    }
}

