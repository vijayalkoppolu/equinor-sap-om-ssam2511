export default async function WHHandlingUnitItemCreate(context) {
    for (const item of context.getClientData().CreatableHU.Items) {
        await context.executeAction({
            Name: '/SAPAssetManager/Actions/EWM/Inbound/HandlingUnit/WHHandlungUnitItemCreate.action',
            Properties: {
                Properties: {
                    StockGUID: item.StockGUID,
                    PackedQuantity: item.PackedQuantity,
                    QuantityUoM: item.QuantityUoM,
                    RefDocId: item.RefDocId,
                    RefItemId: item.RefItemId,
                },
                CreateLinks: item.HandlingUnitItemLinks,
            },
        });
    }
}
