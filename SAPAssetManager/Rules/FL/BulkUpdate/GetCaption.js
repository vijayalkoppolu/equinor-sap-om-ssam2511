import libCom from '../../Common/Library/CommonLibrary';
/**
 * @param {*} context Context for LabelButton extension
 * @returns returns that caption for All(x/y) based on the number of items selected out of total items
 */
export default function GetCaption(context) {
    const selectedItems = libCom.getStateVariable(context, 'BulkUpdateItem'); 
    const totalItems = libCom.getStateVariable(context, 'BulkUpdateTotalItems'); 
    return (selectedItems >= 0 && selectedItems !== totalItems) ? context.localizeText('items_list_title_count_x', [selectedItems, totalItems]) : context.localizeText('items_list_title_count', [totalItems]);
}
