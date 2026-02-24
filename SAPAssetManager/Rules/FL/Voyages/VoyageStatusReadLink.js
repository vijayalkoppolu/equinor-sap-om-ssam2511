/**
 * Returns the read link for the voyage status entity.
 * @param {IClientAPI} context - The MDK context object.
 * @returns {string} - The read link for the voyage status entity.
 */

import { VoyageStatus } from '../Common/FLLibrary';

export default function VoyageStatusReadLink(context) {
    const voyageStatus = VoyageStatus.Arrived;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `FldLogsVoyageStatusCodeTypes('${voyageStatus}')`, [], '').then(result => {
        return result?.length > 0 ? result.getItem(0)?.['@odata.readLink'] ?? '' : '';
    });
}
