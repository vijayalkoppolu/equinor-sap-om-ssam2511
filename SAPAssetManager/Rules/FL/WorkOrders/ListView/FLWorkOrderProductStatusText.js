export default function FLWorkOrderProductStatusText(clientAPI) {
    
    const status = clientAPI.binding.Status;

    if (status === '') {
        return clientAPI.localizeText('fl_wo_product_status_open');
    }
    if (status === 'R') {
        return clientAPI.localizeText('fl_wo_product_status_returned');
    }
    return '';
}
