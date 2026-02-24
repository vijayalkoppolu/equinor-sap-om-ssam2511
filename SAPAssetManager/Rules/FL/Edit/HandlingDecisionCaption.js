/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function HandlingDecisionCaption(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'handling_decision', true);
}
