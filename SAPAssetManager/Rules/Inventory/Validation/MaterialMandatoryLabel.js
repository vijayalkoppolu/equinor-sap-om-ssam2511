import libCom from '../../Common/Library/CommonLibrary';
/**
 * 'Material Number *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */
export default function MaterialMandatoryLabel(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'material', true);
}
