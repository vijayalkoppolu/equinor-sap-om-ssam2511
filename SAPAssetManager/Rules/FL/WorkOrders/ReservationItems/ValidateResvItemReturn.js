import libLoc from '../../../Common/Library/LocalizationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import IsValuationTypeVisible from './IsValuationTypeVisible';
export default async function ValidateResvItemReturn(context) {
    let requestedQty = libLoc.toNumber(context, context.evaluateTargetPath('#Control:WithdrawnQuantity/#Value'));
    let withdrawnQty = Number(context.binding.WithdrawnQty);

    const dict = libCom.getControlDictionaryFromPage(context);

    libCom.setInlineControlErrorVisibility(dict.WithdrawnQuantity, false);
    libCom.setInlineControlErrorVisibility(dict.BatchLstPkr, false);
    libCom.setInlineControlErrorVisibility(dict.SerialNumber, false);
    libCom.setInlineControlErrorVisibility(dict.ValTypeLstPkr, false);
    if (requestedQty && withdrawnQty) {
        if (withdrawnQty <= 0 || (requestedQty - Number(context.binding.EntryQty)) > withdrawnQty) {
            libCom.executeInlineControlError(context, dict.WithdrawnQuantity, context.localizeText('fld_validate_no_qty'));
            return false;
        }
    }
    if (context.binding.IsBatchManaged) {
            let batchIsEmpty = libVal.evalIsEmpty(libCom.getListPickerValue(libCom.getControlProxy(context, 'BatchLstPkr').getValue()));
            if (batchIsEmpty) {
                libCom.executeInlineControlError(context, dict.BatchLstPkr, context.localizeText('fld_validate_batch_required'));
                return Promise.resolve(false);
            }
    }
    if (context.binding.IsSerialized) {
        const serialNumberIsEmpty = libVal.evalIsEmpty(context.evaluateTargetPath('#Control:SerialNumber/#Value'));
        if (serialNumberIsEmpty) {
            libCom.executeInlineControlError(context, dict.SerialNumber, context.localizeText('fld_serial_number_required'));
            return Promise.resolve(false);
        } else if (requestedQty !== 1) {
            libCom.executeInlineControlError(context, dict.WithdrawnQuantity, context.localizeText('fld_serial_number_qty'));
            return Promise.resolve(false);
        }
    }
    const valuation = await IsValuationTypeVisible(context);
    if (valuation) {
         
        const valuationTypeIsEmpty = libVal.evalIsEmpty(libCom.getListPickerValue(libCom.getControlProxy(context, 'ValTypeLstPkr').getValue()));
        if (valuationTypeIsEmpty) {
            libCom.executeInlineControlError(context, dict.ValTypeLstPkr, context.localizeText('fld_valuation_type_required'));
            return Promise.resolve(false);
        }
    }

    dict.WithdrawnQuantity.clearValidation();
    dict.BatchLstPkr.clearValidation();
    dict.SerialNumber.clearValidation();
    return true;

}

