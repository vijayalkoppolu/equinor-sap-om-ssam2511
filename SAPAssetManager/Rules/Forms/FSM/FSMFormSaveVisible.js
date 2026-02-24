import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import FSMSmartFormsLibrary from './FSMSmartFormsLibrary';

/**
* Determine if Save button should be visible or not
* @param {IClientAPI} clientAPI
*/
export default function FSMFormSaveVisible(clientAPI) {
    let fsm = !ValidationLibrary.evalIsEmpty(FSMSmartFormsLibrary.getFSMEmployee(clientAPI));
    return !clientAPI.getPageProxy().binding.Closed && fsm;
}
