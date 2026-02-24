
import libCom from '../../Common/Library/CommonLibrary';
export default function FormatLabelDestStoreLoc(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'fld_dest_storage_location', true);
}


