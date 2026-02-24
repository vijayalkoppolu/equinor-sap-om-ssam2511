import GetPickHUReadLinkForUpdate from '../HandlingUnit/GetPickHUReadLinkForUpdate';
import Logger from '../../../Log/Logger';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function CreateLinks(context) {
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

    // ignore in case of Confirm All scenario
    if (!item) {
        // fetch from picker if handlingunit value is there
        const previousPage = context.evaluateTargetPathForAPI('#Page:WarehouseTaskConfirmation');
        const confirmationFormCellSection = previousPage.getControls('FormCellContainer');
        const handlingUnit = confirmationFormCellSection[0]?.getControl('WhDestinationHUPicker')?.getValue();
        const handlingUnitValue = handlingUnit[0]?.ReturnValue;

        // Check if handlingUnitValue exists, only then proceed with create action
        if (handlingUnitValue) {
            return GetPickHUReadLinkForUpdate(context, handlingUnitValue).then(readLink => {
                links.push({
                    'Property': 'WarehousePickHUTaskC_Nav',
                    'Target': {
                        'EntitySet': 'WarehousePickHUs',
                        'ReadLink': readLink,
                    },
                });
                return links;
            }).catch(error => {
                Logger.error('Error resolving readLink:', error);
                throw error;
            });
        }
    }
    return links;
}
