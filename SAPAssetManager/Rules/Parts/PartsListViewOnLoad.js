import libWOStatus from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import ODataLibrary from '../OData/ODataLibrary';
import setCaption from './PartsListViewCaption';
import openQuantityQueryOptions from '../Extensions/BarcodeScannerQueryOptions';

export default function PartsListViewOnLoad(context) {
    let isLocal = ODataLibrary.isLocal(context.binding);
    setCaption(context);
    if (!isLocal) {
        return libWOStatus.isOrderComplete(context).then(status => {
            if (status) {
                context.setActionBarItemVisible(0, false);
            }
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', openQuantityQueryOptions(context)).then(count => {
                if (count === 0) {
                    context.setActionBarItemVisible(1, false);
                }
            });
        });
    }
}

