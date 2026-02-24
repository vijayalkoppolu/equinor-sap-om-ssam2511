/**
* Returns pre-selected filter criteria for physical inventory not counted.
* @param {IClientAPI} clientAPI - The client API context.
* @returns {Array} An array containing the filter criteria.
* @param {IClientAPI} clientAPI
*/
import PhyInvNotCountedFilterDisplayValue from './ListView/PhyInvNotCountedFilterDisplayValue';
import { WH_PHYINV_NOTCOUNTED_FILTER } from  './WHPhysicalInvListQuery';
export default function GetPhyInvPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'PINotCounted', [PhyInvNotCountedFilterDisplayValue(context)],[WH_PHYINV_NOTCOUNTED_FILTER], true)];
}
