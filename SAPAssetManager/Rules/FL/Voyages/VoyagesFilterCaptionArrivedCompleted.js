import Logger from '../../Log/Logger';
import { VOYAGES_ARRIVED_COMPLETED_FILTER } from './VoyagesOnLoadQuery';
import { removeVoyageDeletedItems } from './VoyagesOnLoadQuery';

export default async function VoyagesFilterCaptionArrivedCompleted(context) {
    
    let baseFilter = `(${VOYAGES_ARRIVED_COMPLETED_FILTER})`;
    try {
          baseFilter = await removeVoyageDeletedItems(context, baseFilter).then(finalFilter => `$filter=${finalFilter}`);
    } catch (error) {
          Logger.error('FL', error);
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyages', baseFilter).then(count => {
          return context.localizeText('fld_voyages_arrived_completed', [count]);
      });
}
