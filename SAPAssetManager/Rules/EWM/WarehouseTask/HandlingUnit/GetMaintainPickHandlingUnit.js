import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetMaintainPickHandlingUnit(context) {

    return CommonLibrary.getStateVariable(context, 'InputtedHandlingUnitValue');

}
