import ODataLibrary from '../../OData/ODataLibrary';

export default function PhysicalInventoryReadLinkIsLocal(context) {
    return ODataLibrary.isLocal(context.binding);  //Was this header or line item created locally on client?
}
