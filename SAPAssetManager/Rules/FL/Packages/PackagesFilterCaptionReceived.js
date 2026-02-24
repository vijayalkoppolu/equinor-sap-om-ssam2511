import { PACKAGES_RECEIVED_FILTER } from './PackagesOnLoadQuery';
import { appendVoyageNumberForPackagesFilter, appendParentContainerIDFilter } from '../Common/FLLibrary';
import { removePackageDeletedItems } from './PackagesOnLoadQuery';
import Logger from '../../Log/Logger';

export default async function PackagesFilterCaptionReceived(context) {

    let baseFilter = `(${PACKAGES_RECEIVED_FILTER})`;
    try {
        baseFilter = await removePackageDeletedItems(context, baseFilter, 'VOY')
            .then(updatedFilter => removePackageDeletedItems(context, updatedFilter, 'CTN'))
            .then(updatedFilter => removePackageDeletedItems(context, updatedFilter, 'PKG'))
            .then(updatedFilter => {
                if (context.binding?.ContainerID) {
                    return appendParentContainerIDFilter(updatedFilter, context);
                } else {
                    return appendVoyageNumberForPackagesFilter(updatedFilter, context);
                }
            })
            .then(finalFilter => `$filter=${finalFilter}`);
    } catch (error) {
        Logger.error('FL', error);
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackages', baseFilter).then(count => {
          return context.localizeText('fld_packages_received', [count]);
    });
}
