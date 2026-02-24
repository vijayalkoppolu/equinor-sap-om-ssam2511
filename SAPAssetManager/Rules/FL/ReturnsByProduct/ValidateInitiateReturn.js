

import libLoc from '../../Common/Library/LocalizationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function ValidateInitiateReturn(context) {
    let requestedQty = libLoc.toNumber(context, context.evaluateTargetPath('#Control:ReturnableQuantity/#Value'));
    let returnableQty = Number(libCom.getStateVariable(context, 'ReturnableQty'));
    const dict = libCom.getControlDictionaryFromPage(context);

    libCom.setInlineControlErrorVisibility(dict.ReturnableQuantity, false);

    if (requestedQty && returnableQty) {
        if (returnableQty <= 0 || requestedQty > returnableQty) {
            libCom.executeInlineControlError(context, dict.ReturnableQuantity, context.localizeText('fld_validate_no_qty'));
            return false;
        }
    }

    dict.ReturnableQuantity.clearValidation();
    return true;

}

