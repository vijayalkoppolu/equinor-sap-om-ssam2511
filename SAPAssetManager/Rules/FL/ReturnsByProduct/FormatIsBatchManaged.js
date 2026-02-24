
export default function FormatIsBatchManaged(clientAPI) {
    return clientAPI.localizeText(clientAPI.binding?.IsInternalBatchManaged === 'X' ? clientAPI.localizeText('yes') : clientAPI.localizeText('no'));
}
