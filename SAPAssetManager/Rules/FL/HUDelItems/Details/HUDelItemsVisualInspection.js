export default function HUDelItemsVisualInspection(clientAPI) {
    let visualInspectionValue = clientAPI.binding.VisualInspection;
    // Query the FldLogsVisualInspection table and fetch the description
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVisualInspections', [], `$filter=VisualInspection eq '${visualInspectionValue}'`)
        .then(result => {
            if (result && result.length > 0) {
                return result.getItem(0).VisualInspectionText || '';
            }
            return '';  
        })
        .catch(() => {
            return ''; 
        });
}
