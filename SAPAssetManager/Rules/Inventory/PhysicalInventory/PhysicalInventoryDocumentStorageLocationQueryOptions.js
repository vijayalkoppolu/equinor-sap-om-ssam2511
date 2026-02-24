import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocumentStorageLocationQueryOptions() {
    let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
    return plant ? `$filter=Plant eq '${plant}'&$orderby=StorageLocation` : '$orderby=StorageLocation';
}
