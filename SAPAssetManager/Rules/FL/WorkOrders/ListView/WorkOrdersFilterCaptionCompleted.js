import { WORK_ORDERS_COMPLETED_FILTER, removeWorkOrderDeletedItems } from '../WorkOrdersOnLoadQuery';
import Logger from '../../../Log/Logger';

export default async function WorkOrdersFilterCaptionCompleted(context) {
        let baseFilter = `(${WORK_ORDERS_COMPLETED_FILTER})`;
        try {
              baseFilter = await removeWorkOrderDeletedItems(context, baseFilter).then(finalFilter => `$filter=${finalFilter}&$expand=FldLogsWoProduct_Nav,FldLogsWoResvItem_Nav`);
        } catch (error) {
              Logger.error('FL', error);
        }
    
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWorkOrders', baseFilter).then(count => {
              return context.localizeText('return_x', [count]);
          });
}
