

export default function IsResvItemReturnButtonEnabled(clientAPI) {

    if (clientAPI.binding.WithdrawnQty) {
        if (Number(clientAPI.binding.WithdrawnQty) === 0) {
            return '';
        }
    }
    if (clientAPI.binding.Status === 'R') {
        return '';
    }
    
    return 'sap-icon://write-new';
}
