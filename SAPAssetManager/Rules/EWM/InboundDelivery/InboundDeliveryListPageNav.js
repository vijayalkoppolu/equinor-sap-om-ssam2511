import libCom from '../../Common/Library/CommonLibrary';

export default function InboundDeliveryListPageNav(context) {
        if (context.searchString) {
            libCom.setStateVariable(context, 'searchString', context.searchString);
        } else {
            libCom.removeStateVariable(context, 'searchString');
        }
    return context.executeAction('/SAPAssetManager/Actions/EWM/InboundDelivery/InboundDeliveryListPageNav.action');
}
