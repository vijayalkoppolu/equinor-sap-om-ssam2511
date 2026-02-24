import GetWarehouseNumber from './GetWarehouseNumber';
/*
* Get the warehouse number and format it with a label.
*/
export default function GetWarehouseWithLabel(context) {
    const warehouse = GetWarehouseNumber();
    return `${context.localizeText('warehouse')} : ${warehouse ? warehouse : context.localizeText('none')}`;
}
