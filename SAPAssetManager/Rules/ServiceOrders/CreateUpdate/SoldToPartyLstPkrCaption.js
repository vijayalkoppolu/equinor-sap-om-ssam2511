import { WorkOrderLibrary as libWo } from '../../WorkOrders/WorkOrderLibrary';
import Logger from '../../Log/Logger';

/**
* Getting default value for sold-to party if it's required
* @param {IClientAPI} context
*/
export default function SoldToPartyLstPkrCaption(context) {
    return libWo.isServiceOrder(context).then(isSrvOrd => {
        if (isSrvOrd) {
            return libWo.getSoldToPartyCaption(context, context.binding.OrderType);
        }
        throw new Error();
    }).catch(err => {
        Logger.error('SoldToPartyLstPkrCaption', err);
        return context.localizeText('sold_to_party');
    });
}
