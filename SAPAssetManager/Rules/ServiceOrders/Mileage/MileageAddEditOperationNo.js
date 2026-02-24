import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditOperationNo(pageProxy) {
    let control = CommonLibrary.getControlProxy(pageProxy, 'OperationPkr');
    return CommonLibrary.getListPickerValue(control.getValue());

}
