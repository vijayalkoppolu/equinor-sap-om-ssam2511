export default function ReadyToPackDescription(clientAPI) {
    return clientAPI.localizeText('fld_sourceplant_colon', [clientAPI.binding.FldLogsSrcePlnt || '-']);
}
