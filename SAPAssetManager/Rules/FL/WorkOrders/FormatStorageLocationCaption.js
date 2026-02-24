import libCom from '../../Common/Library/CommonLibrary';
export default function FormatStorageLocationCaption(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'fld_storage_location', true);
}
