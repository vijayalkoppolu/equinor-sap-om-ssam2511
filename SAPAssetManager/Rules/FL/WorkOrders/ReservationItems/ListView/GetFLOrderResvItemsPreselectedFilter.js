
import FLResvItemsOpenFilterDisplayValue from './FLResvItemsOpenFilterDisplayValue';

export default function GetFLOrderResvItemsPreselectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', [FLResvItemsOpenFilterDisplayValue(context)], ["Status eq ''"],  true)];
}
