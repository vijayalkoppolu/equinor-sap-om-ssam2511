export default function WHHandlingUnitCreateSpecifyQuantityTableNav(context) {
    const pageProxy = context.getPageProxy();
    const formCellContainer = pageProxy.getControl('FormCellContainer');
    const packableItemsCount = +formCellContainer.getControl('QtyToPack').getValue();

    pageProxy.setActionBinding({
        items: pageProxy.getClientData().items || generateHandlingUnitsList(pageProxy, packableItemsCount, formCellContainer),
        packableItemsCount,

    });
    return pageProxy.executeAction('/SAPAssetManager/Actions/EWM/Inbound/HandlingUnit/WHHandlingUnitCreateSpecifyQuantityNav.action');
}

export function generateHandlingUnitsList(context, packableItemsCount, formCellContainer) {
    const formCell = formCellContainer || context.getControl('FormCellContainer');
    const handlingUnits = +formCell.getControl('NumberOfHUs').getValue();

    const base = Math.floor(packableItemsCount / handlingUnits);
    const remainder = packableItemsCount % handlingUnits;
    const result = [];

    for (let i = 0; i < handlingUnits; i++) {
        result.push(base + (i < remainder ? 1 : 0));
    }

    return result.map((qty) => ({
        qty,
        uom: context.binding.UnitofMeasure,
        number: '',
    }));
}
