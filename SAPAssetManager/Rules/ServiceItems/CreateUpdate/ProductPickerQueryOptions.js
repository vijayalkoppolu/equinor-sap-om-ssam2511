import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ProductPickerQueryOptions(context) {
    const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (previousPage && CommonLibrary.getPageName(previousPage) === 'StockListViewPage') {
        return `$orderby=MaterialNum&$filter=MaterialSLocs/any(sloc:(sloc/Plant eq '${CommonLibrary.getUserDefaultPlant()}' and sloc/StorageLocation eq '${CommonLibrary.getUserDefaultStorageLocation()}'))`;
    }

    return '$orderby=MaterialNum';
}
