import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';

export default function AutoCreateWarehouseTaskIsEnabled(context) {
    const putawaystatus = context.getPageProxy()?.binding?.PutawayPlannedStatusValue;

    return putawaystatus === InboundDeliveryStatusValue.Completed ? false : true;
}
