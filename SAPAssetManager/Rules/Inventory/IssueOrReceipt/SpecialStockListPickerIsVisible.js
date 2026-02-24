import ODataLibrary from '../../OData/ODataLibrary';

/**
 * @param {IListPickerFormCellProxy} context
*/
export default function SpecialStockListPickerIsVisible(context) {
    return !!(context.binding && ODataLibrary.isLocal(context.binding));
}
