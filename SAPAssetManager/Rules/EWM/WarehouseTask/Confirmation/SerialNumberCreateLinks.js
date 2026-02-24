
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SerialNumberCreateLinks(context) {
    const item = CommonLibrary.getStateVariable(context, 'WarehouseTask');
    const links = [
        {
            'Property': 'WarehouseTask_Nav',
            'Target': {
                'EntitySet': 'WarehouseTasks',
                'ReadLink': item?.['@odata.readLink'] ?? '{@odata.readLink}',
            },
        },
    ];
    return links;
}
