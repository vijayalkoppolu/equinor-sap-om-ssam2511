import { WORK_ORDERS_OPEN_FILTER, removeWorkOrderDeletedItems } from '../WorkOrdersOnLoadQuery';
import Logger from '../../../Log/Logger';

export default async function WorkOrdersFilterCaptionOpen(context) {
    let baseFilter = `(${WORK_ORDERS_OPEN_FILTER})`;
    try {
        baseFilter = await removeWorkOrderDeletedItems(context, baseFilter).then(finalFilter => `$filter=${finalFilter}&$expand=FldLogsWoProduct_Nav,FldLogsWoResvItem_Nav`);
    } catch (error) {
        Logger.error('FL', error);
    }

       return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWorkOrders', baseFilter).then(count => {
          return context.localizeText('open_x', [count]);
      });
}
