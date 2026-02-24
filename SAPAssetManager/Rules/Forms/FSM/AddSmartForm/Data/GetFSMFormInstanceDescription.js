import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function GetFSMFormInstanceDescription(context) {
    const control = AddSmartFormLibrary.getDescriptionControl(context);
    return CommonLibrary.getControlValue(control);
}
