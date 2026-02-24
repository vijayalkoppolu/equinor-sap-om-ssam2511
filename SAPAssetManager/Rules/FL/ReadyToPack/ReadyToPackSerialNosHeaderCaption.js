
export default function ReadyToPackSerialNosHeaderCaption(clientAPI) {
    const type = clientAPI.binding['@odata.type'];
    let count = 0;

    if (type === '#sap_mobile.FldLogsPackCtnRdyPck') {
        count = clientAPI.binding?.FldLogsPackCtnRdyPckSrNo_Nav?.length || 0;
    } else {
        count = clientAPI.binding?.length || 0;
    }

    return clientAPI.localizeText('fld_serial_numbers_x', [count]);
}
