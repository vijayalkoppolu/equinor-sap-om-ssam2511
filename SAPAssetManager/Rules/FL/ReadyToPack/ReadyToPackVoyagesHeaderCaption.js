export default  function ReadyToPackVoyagesHeaderCaption(context) {

    let binding = context.binding;
    let type = '';
    let entitySet = '';

   if (binding && Array.isArray(binding._array)) {
        type = binding._array[0]?.['@odata.type'] || '';
    }
    
    if (type === '#sap_mobile.FldLogsPackCtnPkgVyg') {
        entitySet = 'FldLogsPackCtnPkgVygs';
    } else if (type === '#sap_mobile.FldLogsPackCtnRdyPckVyg') {
        entitySet = 'FldLogsPackCtnRdyPckVygs';
    } else if (type === '#sap_mobile.FldLogsPackCtnContainerVyg') {
        entitySet = 'FldLogsPackCtnContainerVygs';
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet)
        .then(count => {
            return context.localizeText('items_x', [count]);
        });
}
