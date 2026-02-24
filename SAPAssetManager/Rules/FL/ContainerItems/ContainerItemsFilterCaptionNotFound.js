import { CONTAINER_ITEMS_NOT_FOUND_FILTER } from './ContainerItemsListQueryOptions';
import { appendContainerIDFilter } from '../Common/FLLibrary';

export default function ContainerItemsFilterCaptionNotFound(context) {

      const filter = `$filter=${appendContainerIDFilter(`(${CONTAINER_ITEMS_NOT_FOUND_FILTER})`, context)}`;
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerItems', filter).then(count => {
            return context.localizeText('notfound_items_x', [count]);
      });
}
