
import libCom from '../../Common/Library/CommonLibrary';
export default function FormatQuantityWithdraw(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'fld_reservation_item_qty_withdraw', true);
}
