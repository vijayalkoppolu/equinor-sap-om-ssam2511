

export default function FormatCreateOutboundDelivery(clientAPI) {
    return clientAPI.localizeText(clientAPI.binding?.FldLogsRetOutbDelivIsCreated === 'X' ? clientAPI.localizeText('yes') : clientAPI.localizeText('no'));
}
