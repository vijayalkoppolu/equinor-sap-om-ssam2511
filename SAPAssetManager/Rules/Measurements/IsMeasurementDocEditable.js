import ODataLibrary from '../OData/ODataLibrary';

export default function IsMeasurementDocEditable(pageClientAPI) {
    return ODataLibrary.isLocal(pageClientAPI.binding);
}
