import FLProductOpenFilterDisplayValue from './FLProductOpenFilterDisplayValue';

export default function GetFLOrderProductPreselectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', [FLProductOpenFilterDisplayValue(context)], ["Status eq ''"],  true)];
}
