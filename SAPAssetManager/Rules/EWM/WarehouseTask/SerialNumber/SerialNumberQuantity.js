import { GetQuantityToConfirmFromConfirmationPage } from './SerialNumberLib';

/**
 * Serial number quantity value
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns 
 */
export default function SerialNumberQuantity(context) {
    return GetQuantityToConfirmFromConfirmationPage(context);
}
