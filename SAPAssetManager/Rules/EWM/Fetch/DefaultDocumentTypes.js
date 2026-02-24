import libCom from '../../Common/Library/CommonLibrary';

export default function DefaultDocumentTypes(context) {
    switch (libCom.getPreviousPageName(context)) {
        case 'InboundDeliveryDetailPage':
        case 'InboundDeliveryList':
        case 'WHInboundDeliveryItemDetailsAndSerialNumsPage':
        case 'EWMInboundDeliveryItemListPage':
            return 'WHIB';
        
        case 'EWMOverviewPage': {
            const homePage = context.getPageProxy().evaluateTargetPathForAPI('#Page:EWMOverviewPage');
            const selectedTab = homePage.getControls()[1].getSelectedTabItemName();
            if (selectedTab === 'InboundTab') {
                return 'WHIB';
            }
            return 'WHO';
        }

        default:
            return 'WHO';
    }
}
