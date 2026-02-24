import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function GetFSMFormInstanceResponsiblePerson(context) {
    const control = AddSmartFormLibrary.getResponsiblePersonControl(context);
    return CommonLibrary.getControlValue(control);
}
