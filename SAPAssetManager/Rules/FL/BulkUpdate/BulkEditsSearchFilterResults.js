
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function BulkEditsSearchFilterResults(context) {
    const fcContainer = context.getControl('FormCellContainer');
    const filterResults = ['ProductIDFilter', 'ReferenceDocFilter', 'ItemStatusFilter', 'HandlingDecisionsFilter', 'StorageLocationFilter']
                          .map((n) => fcContainer.getControl(n).getFilterValue());
   
    return filterResults;
}
