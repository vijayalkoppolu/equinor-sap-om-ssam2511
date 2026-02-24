import libCom from '../../Common/Library/CommonLibrary';
export default function FormatLabelReceivingPoint(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'fld_receiving_point', true);
}
