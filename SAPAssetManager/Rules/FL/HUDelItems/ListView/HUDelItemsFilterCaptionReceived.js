import { HU_DEL_ITEMS_RECEIVED_FILTER } from './HUDelItemsOnLoadQuery';
import { appendVoyageNumberForContainerorHUDelItemFilter, appendParentContainerIDFilter } from '../../Common/FLLibrary';
import { removeHUDelItemsDeletedItems } from './HUDelItemsOnLoadQuery';
import Logger from '../../../Log/Logger';
 
export default async function HUDelItemsFilterCaptionReceived(context) {
    let baseFilter = `(${HU_DEL_ITEMS_RECEIVED_FILTER})`;
    try {
        baseFilter = await removeHUDelItemsDeletedItems(context, baseFilter, 'VOY')
              .then(updatedFilter => removeHUDelItemsDeletedItems(context, updatedFilter, 'HDI'))
              .then(updatedFilter => {
                if (context.binding?.ContainerID) {
                    return appendParentContainerIDFilter(updatedFilter, context);
                } else {
                    return appendVoyageNumberForContainerorHUDelItemFilter(updatedFilter, context);
                }
            })
              .then(finalFilter => `$filter=${finalFilter}`);
    } catch (error) {
        Logger.error('FL', error);
    }
    
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHuDelItems', baseFilter).then(count => {
        return context.localizeText('fld_packages_received', [count]);
    });
}
