import InboundDeliveryDetailsView from '../../InboundDelivery/InboundDeliveryDetailsView';
import libCom from '../../../Common/Library/CommonLibrary';

export default function WHInboundDeliveryItemAvatarIcon(context) {
    const pageProxy = context.getPageProxy();
    const page = libCom.getPageName(pageProxy);
    const avatars = [];

    if (InboundDeliveryDetailsView(context) || page === 'InboundTab' || page === 'EWMInboundDeliveryItemListPage') {
        avatars.push({
            'Image': 'sap-icon://open-command-field',
			'Style': '$(PLT, InboundDeliveryItemIcon, InboundDeliveryItemIconAndroid)',
        });
    }

    return avatars;
}
