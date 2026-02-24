import CommonLibrary from '../../Common/Library/CommonLibrary';
import ExcludeSelectExpandOptions from '../../Measurements/ExcludeSelectExpandOptions';
import FSMCrewLibrary from '../FSMCrewLibrary';

export default async function FSMCrewCaption(context) {
    const fsmCrewQueryOptions = await FSMCrewLibrary.getFSMCrewQuery(context);
    const totalCrewCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'CrewLists', `$filter=${fsmCrewQueryOptions}`);
    
    let queryOption = CommonLibrary.getQueryOptionFromFilter(context);
    if (queryOption) {
        queryOption = ExcludeSelectExpandOptions(queryOption);
       
        const filteredCrewQueryOption = queryOption ? queryOption + ' and ' + fsmCrewQueryOptions : '$filter=' + fsmCrewQueryOptions;
        const filteredCrewCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'CrewLists', filteredCrewQueryOption);
        
        if (totalCrewCount === filteredCrewCount) {
            return context.localizeText('crew_x', [totalCrewCount]);
        } else {
            return context.localizeText('crew_x_x', [filteredCrewCount, totalCrewCount]);
        }
    }
   
    return context.localizeText('crew_x', [totalCrewCount]);
}
