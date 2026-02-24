
import libLoc from '../../Common/Library/LocalizationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function ValidatePickQty(context) {
    let PickQty = libLoc.toNumber(context, context.evaluateTargetPath('#Control:LoadingQuantity/#Value'));
    let returnableQty = Number(libCom.getStateVariable(context, 'ReturnableQty'));
    const dict = libCom.getControlDictionaryFromPage(context);
    dict.LoadingQuantity.clearValidation();

    libCom.setInlineControlErrorVisibility(dict.LoadingQuantity, false);

    if (PickQty && returnableQty) {
        if (PickQty === returnableQty) {
            dict.LoadingQuantity.clearValidation();
            return true;
        }
        libCom.executeInlineControlError(context, dict.LoadingQuantity, context.localizeText('fld_validate_pick_qty'));
        return false;
    }
    libCom.executeInlineControlError(context, dict.LoadingQuantity, context.localizeText('fld_validate_pick_qty'));
    return false;


}



