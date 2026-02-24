import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditWorkCenter(pageProxy) {
   
    let control = CommonLibrary.getControlProxy(pageProxy, 'WorkCenterPicker');
    return CommonLibrary.getListPickerValue(control.getValue());
    
}
