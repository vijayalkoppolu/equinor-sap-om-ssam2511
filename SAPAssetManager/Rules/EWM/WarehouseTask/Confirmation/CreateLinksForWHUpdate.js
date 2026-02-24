import GetPickHUReadLinkForUpdate from '../HandlingUnit/GetPickHUReadLinkForUpdate';
import Logger from '../../../Log/Logger';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function CreateLinksForWHUpdate(context) {

    // fetch from picker if handlingunit value is there
   const handlingUnitValue = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:WarehouseTaskConfirmationLocalEditPage/#Control:WhDestinationHUPicker').getValue());
   const links = [];

    // Check if handlingUnitValue is inputted by user, only then proceed with create action
    if (handlingUnitValue) {
        return GetPickHUReadLinkForUpdate(context,handlingUnitValue).then(readLink => {
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
    } else {
        return Promise.resolve(links);
    }
}
