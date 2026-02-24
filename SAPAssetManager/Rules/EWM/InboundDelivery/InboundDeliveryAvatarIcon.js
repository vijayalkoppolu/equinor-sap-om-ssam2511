import libCom from '../../Common/Library/CommonLibrary';

export default function InboundDeliveryAvatarIcon(context) {
    const pageProxy = context.getPageProxy();
        const page = libCom.getPageName(pageProxy);
        const avatars = [];
    
        if (page === 'InboundTab' || page === 'InboundDeliveryList') {
            avatars.push({
                'Image': 'sap-icon://forward',
                'Style': '$(PLT, InboundDeliveryIcon, InboundDeliveryIconAndroid)',
            });
        }

        return avatars;
}
