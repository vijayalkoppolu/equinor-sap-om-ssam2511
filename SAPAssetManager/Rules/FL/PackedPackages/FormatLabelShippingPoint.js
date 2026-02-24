import libCom from '../../Common/Library/CommonLibrary';
/**
* This function formats the label for the shipping point field.
* @param {IClientAPI} clientAPI
*/
export default function FormatLabelShippingPoint(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'fld_shipping_point', true);
}
