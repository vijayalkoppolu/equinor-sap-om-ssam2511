import OperationMobileStatusHelper from './OperationMobileStatusHelper';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default class OperationCapacityMobileStatusHelper extends OperationMobileStatusHelper {

    isObjectAssignedToCurrentUser() {
        const DEFAULT_PERSON_NUM = '00000000';

        return this._binding.PersonnelNo === CommonLibrary.getPersonnelNumber() || this._binding.PersonnelNo === DEFAULT_PERSON_NUM;
    }

    isAssignStatusVisible() {
        return false;
    }

    isUnassignReassignStatusVisible() {
        return false;
    }
}
