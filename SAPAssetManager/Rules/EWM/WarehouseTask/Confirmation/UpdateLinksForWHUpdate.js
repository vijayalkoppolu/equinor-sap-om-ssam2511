
export default function UpdateLinksForWHUpdate(context) {
    const links = [];
    links.push({
        'Property': 'WarehouseTask_Nav',
        'Target': {
            'EntitySet': 'WarehouseTasks',
            'ReadLink': context.binding.WarehouseTask_Nav['@odata.readLink'],
        },
    });
    return links;

}
