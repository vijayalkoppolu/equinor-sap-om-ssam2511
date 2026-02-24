import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditOrderId(pageProxy) {
        let control = CommonLibrary.getControlProxy(pageProxy, 'OrderLstPkr');
        return CommonLibrary.getListPickerValue(control.getValue());
}
