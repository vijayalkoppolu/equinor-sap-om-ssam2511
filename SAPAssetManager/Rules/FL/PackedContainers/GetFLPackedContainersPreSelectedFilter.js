import FLPackContainerFilterCaptionInPacking from './FLPackContainerFilterCaptionInPacking';
import { IN_PACKING_STATUS_FILTER } from './FLPackContainerFilterCaptionInPacking';
/*
* This function sets default filter for Ready To Pack page
* @param {IClientAPI} context
*/
export default function GetFLPackedContainersPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'AvailableForPackingStatus', [FLPackContainerFilterCaptionInPacking(context)],[IN_PACKING_STATUS_FILTER], true)];
}
