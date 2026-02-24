import { CONTAINERS_RECEIVED_FILTER } from './ContainersListQueryOptions';
import { appendVoyageNumberForContainerorHUDelItemFilter } from '../../Common/FLLibrary';
import { removeContainerDeletedItems } from './ContainersListQueryOptions';
import Logger from '../../../Log/Logger';

export default async function ContainersFilterCaptionReceived(context) {

      let baseFilter = `(${CONTAINERS_RECEIVED_FILTER})`;
      try {
            baseFilter = await removeContainerDeletedItems(context, baseFilter, 'VOY')
                  .then(updatedFilter => removeContainerDeletedItems(context, updatedFilter, 'CTN'))
                  .then(updatedFilter => appendVoyageNumberForContainerorHUDelItemFilter(updatedFilter, context))
                  .then(finalFilter => `$filter=${finalFilter}`);
      } catch (error) {
            Logger.error('FL', error);
      }

      return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainers', baseFilter).then(count => {
            return context.localizeText('received_items_x', [count]);
      });
}
