/**
* Returns Inbound Delivery Packing Status tag
* @param {IClientAPI} context
*/
import WHInboundDeliveryPackingStatus from '../Inbound/WHInboundDeliveryPackingStatus';

export default function GetInboundDeliveryTags(context, binding = context.binding) {
    const tags = [];
    const returnValue = WHInboundDeliveryPackingStatus(context);
    const storagebin = binding?.StorageBin;

    tags.push({
        Text: context.localizeText('packing_status_x', [returnValue]),
    });

    if (storagebin) {
        tags.push({Text: storagebin});
    }

    return tags;
}
