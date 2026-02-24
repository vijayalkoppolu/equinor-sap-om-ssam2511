
import libCom from '../../Common/Library/CommonLibrary';
export default function FormatLabelReturnQty(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'fld_returnable_quantity', true);
}
