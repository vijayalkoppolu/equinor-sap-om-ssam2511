
export default function MileageAddEditOrderIsEditable(listPickerProxy) {
    const binding = listPickerProxy.getPageProxy().binding;
    return binding.OrderId || binding.OrderID ? false : true;
}
