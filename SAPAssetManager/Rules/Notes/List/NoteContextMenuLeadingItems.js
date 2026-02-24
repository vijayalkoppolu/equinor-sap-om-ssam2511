import ODataLibrary from '../../OData/ODataLibrary';

export default function NoteContextMenuLeadingItems(context) {
    return ODataLibrary.isLocal(context.binding) ? ['DiscardNote'] : [];
}
