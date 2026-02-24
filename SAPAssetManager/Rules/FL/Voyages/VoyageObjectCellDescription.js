export default async function VoyageObjectCellDescription(context) {
    const containerEntitySet = 'FldLogsContainers';
    const packageEntitySet = 'FldLogsPackages';
    const huDelItemsEntitySet = 'FldLogsHuDelItems';
    const voyageNumber = context.binding.VoyageNumber;
    const filterQuery = `$filter=VoyageNumber eq '${voyageNumber}'`;

    // Fetch the counts for each entity set
    const containerCount = await context.count('/SAPAssetManager/Services/AssetManager.service', containerEntitySet, filterQuery);
    const packageCount = await context.count('/SAPAssetManager/Services/AssetManager.service', packageEntitySet, filterQuery);
    const huDelItemsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', huDelItemsEntitySet, filterQuery);

    // Create the labels and values
    const counts = [
        { label: containerCount === 1 ? 'x_container' : 'x_containers', val: containerCount },
        { label: packageCount === 1 ? 'x_package' : 'x_packages', val: packageCount },
        { label: huDelItemsCount === 1 ? 'x_item' : 'x_items', val: huDelItemsCount },
    ];

    return counts
        .filter((prop) => !!prop.val)
        .map((prop) => context.localizeText(prop.label, [prop.val]))
        .join(', ');
}
