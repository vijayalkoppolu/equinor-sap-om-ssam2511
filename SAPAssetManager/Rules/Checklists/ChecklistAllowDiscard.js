import ODataLibrary from '../OData/ODataLibrary';

export default function ChecklistAllowDiscard(context) {
    return  ODataLibrary.isLocal(context.binding);
}
