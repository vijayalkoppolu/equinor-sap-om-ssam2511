import libCom from '../../../Common/Library/CommonLibrary';

export default function WHInboundDeliveryItemsListNav(context) {
    if (context.searchString) {
        libCom.setStateVariable(context, 'searchString', context.searchString);
    } else {
        libCom.removeStateVariable(context, 'searchString');
    }

    return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/WHInboundDeliveryItemsListDetailNav.action');
}
