import { PACKAGE_ITEMS_NOT_FOUND_FILTER } from './PackageItemsOnLoadQuery';
import { appendContainerIDFilter } from '../Common/FLLibrary';

export default function PackageItemsFilterCaptionNotFound(context) {

      const filter = `$filter=${appendContainerIDFilter(`(${PACKAGE_ITEMS_NOT_FOUND_FILTER})`, context)}`;
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackageItems', filter).then(count => {
            return context.localizeText('notfound_items_x', [count]);
      });
}
