import libCom from '../../Common/Library/CommonLibrary';
export default function FormatLabelPickQty(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'fld_loading_quantity', true);
}
