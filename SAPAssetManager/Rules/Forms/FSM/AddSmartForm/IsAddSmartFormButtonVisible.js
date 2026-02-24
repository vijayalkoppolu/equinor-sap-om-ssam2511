import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import MobileStatusLibrary from '../../../MobileStatus/MobileStatusLibrary';
import IsServiceItem from '../../../ServiceItems/CreateUpdate/IsServiceItem';
import IsS4ServiceIntegrationEnabled from '../../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';
import FSMSmartFormsLibrary from '../FSMSmartFormsLibrary';

export default async function IsAddSmartFormButtonVisible(context, binding = (context?.getPageProxy?.() && context.getPageProxy().binding) || context.binding) {
    const isFeatureEnabled = IsS4ServiceIntegrationEnabled(context) ? FSMSmartFormsLibrary.isS4SmartFormsFeatureEnabled(context) : FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context);
    if (!isFeatureEnabled || ValidationLibrary.evalIsEmpty(binding) || !FSMSmartFormsLibrary.isSmartFormCreateEnabled(context)) return Promise.resolve(false);

    let isVisible = false;

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        const isServiceItemCompleted = await S4ServiceLibrary.isServiceObjectCompleted(context, binding);
        const isServiceItem = await IsServiceItem(context, binding);
        isVisible = !isServiceItemCompleted && isServiceItem;
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        const isServiceItemCompleted = await S4ServiceLibrary.isServiceObjectCompleted(context, binding);
        isVisible = !isServiceItemCompleted;
    }

    const isOperationStatusChangeable = MobileStatusLibrary.isOperationStatusChangeable(context);
    const isHeaderStatusChangeable = MobileStatusLibrary.isHeaderStatusChangeable(context);
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        const isOperationCompleted = await MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderOperations', binding.OrderId, binding.OperationNo);
        isVisible = !isOperationCompleted && (isOperationStatusChangeable || isHeaderStatusChangeable);
    }

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        const isOrderCompleted = await MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderHeaders', binding.OrderId);
        isVisible = !isOrderCompleted && (isOperationStatusChangeable || isHeaderStatusChangeable);
    }

    return isVisible && !CommonLibrary.isEntityLocal(binding);
}
