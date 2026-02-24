import FLReadyToPackFilterCaptionAvailableForPacking from './FLReadyToPackFilterCaptionAvailableForPacking';
import { AVAILABLE_FOR_PACK_STATUS_FILTER } from './FLReadyToPackFilterCaptionAvailableForPacking';
/*
* This function sets default filter for Ready To Pack page
* @param {IClientAPI} context
*/
export default function GetFLReadyToPackAvailableForPackingPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'AvailableForPackingStatus', [FLReadyToPackFilterCaptionAvailableForPacking(context)],[AVAILABLE_FOR_PACK_STATUS_FILTER], true)];
}
