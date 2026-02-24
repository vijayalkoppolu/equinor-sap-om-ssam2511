import issuedSerialNumberQuery from './SerialNumbersIssuedQuery';

export default function SerialNumbersListView(context) {
    const binding = context.getPageProxy().binding;
    return issuedSerialNumberQuery(context, binding).then((serialNumsArray) => {
        if (serialNumsArray && serialNumsArray.length > 0) {
            binding.SerialNumsArray = serialNumsArray;
        } else {
            binding.SerialNumsArray = [];
        }
        context.getPageProxy().setActionBinding(binding);
        return context.executeAction('/SAPAssetManager/Actions/Parts/SerialPartsListViewNav.action');  
    });
}
