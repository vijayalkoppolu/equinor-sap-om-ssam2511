import ODataLibrary from '../OData/ODataLibrary';

/**
* Determine if we can edit a part
*/
export default function PartEditEnable(context, customBinding) {
    const binding = customBinding || context.binding;

    return ODataLibrary.isLocal(binding);
}
