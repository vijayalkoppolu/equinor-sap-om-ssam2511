import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import IsS4ServiceOrderFeatureDisabled from './IsS4ServiceOrderFeatureDisabled';
import S4ServiceLibrary from './S4ServiceLibrary';

/**
* Returning actual query options depending on current date
* filter only by service items, so different types would be ignored
* @param {IClientAPI} context
*/
export default function ServiceItemsTodayList(context) {
    if (IsS4ServiceOrderFeatureDisabled(context)) return '$filter=false';
        
    const defaultDates = libWO.getActualDates(context);
    let categoryFilterQuery = S4ServiceLibrary.itemsServiceItemTypesQuery(context);

    return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [], defaultDates, categoryFilterQuery).then(filter => {
        return `${filter} and CrewID eq ''&$expand=S4ServiceOrder_Nav,ItemCategory_Nav,ServiceType_Nav,Product_Nav,MobileStatus_Nav,AccountingInd_Nav,TransHistories_Nav/S4ServiceContract_Nav,ServiceProfile_Nav&$top=3`;
    });
}
