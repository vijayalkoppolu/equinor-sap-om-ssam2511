/**
 * Get substatus text for Inbound Delivery (Completed of All)
 * @param {IClientAPI} context
 */
import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default async function GetInboundDeliverySubstatusText(context) {
    const pageName = libCom.getPageName(context);
    if (pageName === 'EWMFetchOnlineDocumentsPage') {
        return ' ';
    }
    let completedCount = await CountItems(context, `GRStatusValue eq '${InboundDeliveryStatusValue.Completed}'`);
    let allCount = await CountItems(context, '');
    let notRelevantCount = await CountItems(context, `GRStatusValue eq '${InboundDeliveryStatusValue.NotRelevant}'`);
    let allRelevantCount = allCount - notRelevantCount;
    return `${completedCount} of ${allRelevantCount}`;
}

async function CountItems(context, query) {
    const inboundDelivery = context.binding.EWMDeliveryNum;
    let queryOptions = `$filter=DocumentNumber eq '${inboundDelivery}'`;
    queryOptions += query ? ` and (${query})` : '';

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveryItems', queryOptions);
}
