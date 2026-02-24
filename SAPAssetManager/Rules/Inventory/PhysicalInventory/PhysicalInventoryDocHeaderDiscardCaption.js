import ODataLibrary from '../../OData/ODataLibrary';

export default function PhysicalInventoryDocHeaderDiscardCaption(context) {
    if (context.binding && ODataLibrary.isLocal(context.binding)) {
        return context.localizeText('discard');
    }
    return ' ';
}
