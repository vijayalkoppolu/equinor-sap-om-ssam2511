import { PACKAGE_ITEMS_RECEIVED_FILTER } from './PackageItemsOnLoadQuery';
import { appendContainerIDFilter } from '../Common/FLLibrary';

export default function PackageItemsFilterCaptionReceived(context) {

    let baseFilter = `(${PACKAGE_ITEMS_RECEIVED_FILTER})`;
    baseFilter = appendContainerIDFilter(baseFilter, context);
    let filter = `$filter=${baseFilter}`;

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackageItems', filter).then(count => {
          return context.localizeText('fld_packages_received', [count]);
    });
}
