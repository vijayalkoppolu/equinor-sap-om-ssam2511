import FLReturnsByProductFilterCaptionRemote from './FLReturnsByProductFilterCaptionRemote';
import {AT_REMOTE_STATUS_FILTER} from './FLReturnsByProductFilterCaptionRemote';
/*
* This function sets default filter for Returns By Products page
* @param {IClientAPI} context
*/
export default function GetFLReturnsByProductAtRemotePreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'AtRemoteStatus', [FLReturnsByProductFilterCaptionRemote(context)],[AT_REMOTE_STATUS_FILTER], true)];
}
