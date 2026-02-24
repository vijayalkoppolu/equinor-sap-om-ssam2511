export default function FormatFLOrderProductBatch(clientAPI) {
    var batchManaged;
    if (clientAPI.binding.IsBatchManaged === '' || clientAPI.binding.IsBatchManaged === null || clientAPI.binding.IsBatchManaged === false) {
        return '';
    } else {
        batchManaged = clientAPI.localizeText('yes');
    }
    return clientAPI.localizeText('batch_managed', [batchManaged]);
}


