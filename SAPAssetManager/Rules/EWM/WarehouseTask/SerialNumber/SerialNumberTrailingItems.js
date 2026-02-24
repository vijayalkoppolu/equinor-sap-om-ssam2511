import InboundDeliveryItemDetailsView from '../../Inbound/Items/InboundDeliveryItemDetailsView';

/**
 * Allow delete action if SN is local and can be removed
 * @param {IClientAPI} context 
 * @returns delete action if SN is local and can be removed
 */
export default function SerialNumbersTrailingItems(context) {
    if (InboundDeliveryItemDetailsView(context)) {
       return context.binding.downloaded ? [] : ['Delete_Item'];
    } else {
       return context.binding.usedInOtherConfirmation || context.binding.downloaded ? [] : ['Delete_Item'];
    }
}
