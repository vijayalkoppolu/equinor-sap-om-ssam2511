import { FAST_FILTERS } from './FastFilters';
export function MyFlocFastFilterItem(query) {
    return {
        _Name: FAST_FILTERS.MY_FLOCS,
        _Type: 'Control.Type.FastFilterItem',
        FilterType: 'Filter',
        FilterProperty: '',
        DisplayValue: '$(L,my_functional_locations)',
        ReturnValue: query,
        CustomQueryGroup: '',
        Label: '',
    };
}
