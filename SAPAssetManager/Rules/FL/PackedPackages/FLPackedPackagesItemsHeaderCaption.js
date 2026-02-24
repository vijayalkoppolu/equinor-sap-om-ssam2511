
export default function FLPackedPackagesItemsHeaderCaption(clientAPI) {
    const type = clientAPI.binding['@odata.type'];
    let count = 0;

    if (type === '#sap_mobile.FldLogsPackCtnPkdPkg') {
        count = clientAPI.binding?.FldLogsPackCtnPkgItem_Nav?.length || 0;
    } else if (type === '#sap_mobile.FldLogsPackCtnPkdCtn') {
        count = clientAPI.binding?.FldLogsPackCtnContainerItem_Nav?.length || 0;
    } else {
        count = clientAPI.binding?.length || 0;
    }

    return clientAPI.localizeText('items_x', [count]);
}
