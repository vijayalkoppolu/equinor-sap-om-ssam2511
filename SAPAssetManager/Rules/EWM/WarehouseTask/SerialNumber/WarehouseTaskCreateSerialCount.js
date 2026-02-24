export default async function WarehouseTaskCreateSerialCount(context) {
    const binding = context.binding;
    const serialized = binding?.Serialized;
    if (!serialized) {
        return '';
    }
    const quantity = parseFloat(context.evaluateTargetPath('#Control:WhQuantitySimple/#Value'));
    const serialcount = await getSerialNumberCount(context);

    return quantity ? `${serialcount}/${quantity}` : '';
}

export async function getSerialNumberCount(context) {
    try {
        return await context.count(
            '/SAPAssetManager/Services/AssetManager.service',
            `${context.binding['@odata.readLink']}/SerialNumber_Nav`,
        );
    } catch (error) {
        console.error('Failed to fetch serial count:', error);
        return 0;
    }
}
