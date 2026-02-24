
/*
* This function sets default filter for packed packages
* @param {IClientAPI} context
*/
import  { IN_PACKING_STATUS_FILTER } from './FLPackedPackageCaptionInPacking';
import  FLPackedPackageCaptionInPacking  from './FLPackedPackageCaptionInPacking';

export default function GetFLPackedPackagesInPackingPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'InPackingStatus', [FLPackedPackageCaptionInPacking(context)],[IN_PACKING_STATUS_FILTER], true)];
}
