import { FAST_FILTERS } from './FastFilters';
export function MyEquipmentFastFilterItem(query) {
    return {
        _Name: FAST_FILTERS.MY_EQUIPMENT,
        _Type: 'Control.Type.FastFilterItem',
        FilterType: 'Filter',
        FilterProperty: '',
        DisplayValue: '$(L,my_equipment)',
        ReturnValue: query,
        CustomQueryGroup: '',
        Label: '',
    };
}
