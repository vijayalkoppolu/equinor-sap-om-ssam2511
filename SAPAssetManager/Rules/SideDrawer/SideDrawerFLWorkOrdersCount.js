import { WorkOrdersListFilterAndSearchQuery } from '../FL/WorkOrders/WorkOrdersOnLoadQuery';

export default function SideDrawerFLWorkOrdersCount(context) {
    return WorkOrdersListFilterAndSearchQuery(context, false, false)
        .then(filter => {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWorkOrders', filter);
        })
        .then(count => {
            return context.localizeText('fld_return_by_order', [count]);
        });
}
