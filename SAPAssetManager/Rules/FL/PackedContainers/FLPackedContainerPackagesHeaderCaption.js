
export default function FLPackedContainerPackagesHeaderCaption(clientAPI) {
    const type = clientAPI.binding['@odata.type'];
    let count = 0;

    if (type === '#sap_mobile.FldLogsPackCtnPkdCtn') {
        count = clientAPI.binding?.FldLogsPackCtnContainerPkg_Nav?.length || 0;
    } else {
        count = clientAPI.binding?.length || 0;
    }

    return clientAPI.localizeText('items_x', [count]);
}
