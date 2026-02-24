import { VOYAGES_INTRANSIT_FILTER } from './VoyagesOnLoadQuery';
import { removeVoyageDeletedItems } from './VoyagesOnLoadQuery';
import Logger from '../../Log/Logger';

export default async function VoyagesFilterCaptionInTransit(context) {

    let baseFilter = `(${VOYAGES_INTRANSIT_FILTER})`;
    try {
          baseFilter = await removeVoyageDeletedItems(context, baseFilter).then(finalFilter => `$filter=${finalFilter}`);
    } catch (error) {
          Logger.error('FL', error);
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyages', baseFilter).then(count => {
          return context.localizeText('fld_voyages_in_transit', [count]);
      });
}
