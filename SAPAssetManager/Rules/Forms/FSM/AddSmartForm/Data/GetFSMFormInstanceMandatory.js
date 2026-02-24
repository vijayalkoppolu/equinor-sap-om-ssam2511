import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function GetFSMFormInstanceMandatory(context) {
    const control = AddSmartFormLibrary.getMandatorySwitchControl(context);
    return CommonLibrary.getControlValue(control);
}
