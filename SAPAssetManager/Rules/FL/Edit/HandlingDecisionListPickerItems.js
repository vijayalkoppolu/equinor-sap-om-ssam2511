/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function HandlingDecisionListPickerItems(clientAPI) {
    const processType = clientAPI.binding.ProcessType;
    var filterQuery = '';

    if (processType) {
    filterQuery = `$filter=ProcessType eq '${processType}'&$orderby=HandlingDecision,ProcessType`;
    } else {
    filterQuery = '$orderby=HandlingDecision,ProcessType';
    }
    
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHandlingDecisions', [], filterQuery).then(obArray => {
        let jsonResult = [];
        obArray.forEach(function(element) {
            jsonResult.push(
                {
                    'DisplayValue': `${element.HandlingDecision} - ${element.Description}`,
                    'ReturnValue': element.HandlingDecision,
                });
        });
        const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
        const finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}
