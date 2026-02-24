import InboundDeliveryItemDetailsView from '../../Inbound/Items/InboundDeliveryItemDetailsView';
import libCom from '../../../Common/Library/CommonLibrary';

export default function GetListEditIcon(context, binding = context.binding) {

    if (InboundDeliveryItemDetailsView(context)) {
        return libCom.isCurrentReadLinkLocal(binding?.['@odata.readLink']) && binding?.WarehouseTask?.includes('LOCAL') ? 'sap-icon://delete' : '';
        
    } else {
        const wtstatus = context.binding?.WTStatus;
        if (wtstatus !== 'C') {
          return 'sap-icon://write-new';
        }
    }
}
