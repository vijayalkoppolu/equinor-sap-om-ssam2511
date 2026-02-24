/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
import { validateField } from './FLDocumentUpdate';
export default function ValidateOnLoad(clientAPI) {
    libCom.saveInitialValues(clientAPI);

    if (!libCom.getStateVariable(clientAPI, 'Receive')) {
        return Promise.resolve(true);
    }

    const handlingDecisionListPicker = libCom.getControlProxy(clientAPI, 'HandlingDecisionListPicker');
    const sLoctLstPkr = libCom.getControlProxy(clientAPI, 'SLoctLstPkr');

    const handlingDecision = libCom.getListPickerValue(handlingDecisionListPicker.getValue());
    const destStorLocID = libCom.getListPickerValue(sLoctLstPkr.getValue());

    return Promise.all([
        validateField(clientAPI, handlingDecisionListPicker, handlingDecision),
        validateField(clientAPI, sLoctLstPkr, destStorLocID),
    ]);
}
