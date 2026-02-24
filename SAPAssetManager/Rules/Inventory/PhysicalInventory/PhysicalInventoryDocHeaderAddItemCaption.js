import ODataLibrary from '../../OData/ODataLibrary';

export default function PhysicalInventoryDocHeaderAddItemCaption(context) {
    if (context.binding && ODataLibrary.isLocal(context.binding)) {
        return context.localizeText('add_another_item');
    }
    return ' ';
}
