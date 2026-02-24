import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Returns the filter values for the Production Order search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns Production Order search filters
 */
export default function ProductionOrderSearchFilterResults(context) {
    const filterProps = [
        'ItemNum',
        'MaterialNum',
        'Batch',
        'StorageBin',
    ];
    return libFilter.GetSearchFilterResults(context, filterProps);
}

