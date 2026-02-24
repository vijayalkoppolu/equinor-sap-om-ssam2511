import ODataLibrary from '../../OData/ODataLibrary';

export default function EnableMaterialDocumentEditable(context) {
    return ODataLibrary.isLocal(context.binding);
}


