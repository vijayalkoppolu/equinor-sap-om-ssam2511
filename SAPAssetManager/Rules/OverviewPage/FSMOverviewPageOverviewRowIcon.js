import ValidationLibrary from '../Common/Library/ValidationLibrary';
import IsAndroid from '../Common/IsAndroid';
import ODataDate from '../Common/Date/ODataDate';
import QueryBuilder from '../Common/Query/QueryBuilder';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import FetchRequest from '../Common/Query/FetchRequest';
import ODataLibrary from '../OData/ODataLibrary';

export default function FSMOverviewPageOverviewRowIcon(context) {

    let queryBuilder = new QueryBuilder();

    const defaultDate = context.getBindingObject().PostingDate;
    let oDataDate = new ODataDate(defaultDate);
    let dateQuery = oDataDate.queryString(context, 'date');
    queryBuilder.addFilter(`PostingDate eq ${dateQuery}`);

    return WorkOrdersFSMQueryOption(context).then(orderTypes => {
        if (!ValidationLibrary.evalIsEmpty(orderTypes)) {
            queryBuilder.addFilter(orderTypes);
        }

        let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

        return fetchRequest.execute(context).then(result => {

            let icons = [];
    
            result.some(conf => {
                if (ODataLibrary.hasAnyPendingChanges(conf)) {
                    icons.push(IsAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                    return true;
                }
                return false;
            });
            return icons;
        });
    });
}
