export default function WHHandlingUnitMixedCreateNav(context) {
    const pageProxy = context.getPageProxy();
    const section = pageProxy.getControls()[0].getSections()[0];

    pageProxy.setActionBinding({
        inboundDelivery: pageProxy.binding,
        items: section.getSelectedItems().map(item => item.binding),
    });
    return pageProxy.executeAction('/SAPAssetManager/Actions/EWM/Inbound/HandlingUnit/WHHandlingUnitMixedCreateNav.action');
}
