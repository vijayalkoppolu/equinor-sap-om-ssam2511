import CommonLibrary from '../../Common/Library/CommonLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';

export default function BillToPartyPickerQueryOptions(control) {
    let queryOptions = new QueryBuilder();
    queryOptions.addExpandStatement('S4BusinessPartner_Nav');

    const formCellContainer = control.getPageProxy().getControl('FormCellContainer');
    if (CommonLibrary.isDefined(formCellContainer)) { 
        const soldToPartyLstPkrValue = CommonLibrary.getListPickerValue(formCellContainer.getControl('SoldToPartyLstPkr').getValue());
        if (CommonLibrary.isDefined(soldToPartyLstPkrValue)) {
            queryOptions.addFilter(`BusinessPartnerFrom eq '${soldToPartyLstPkrValue}'`);
        }
    }

    const relTypeFilterString = getRelTypeFilters(control);
    if (relTypeFilterString) {
        queryOptions.addFilter(relTypeFilterString);
    }
    
    return queryOptions.build();
}

function getRelTypeFilters(control) {
    const relTypes = CommonLibrary.getAppParam(control, 'S4BPRELTYPE', control.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/BillToParty.global').getValue());
    let relTypesArray = relTypes.split(',');
    return relTypesArray.map(type => `RelType eq '${type}'`).join(' or ');
}
