import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';
/**
* There are 2 configurations in the backend that need to be accounted for:
* If MeasurementDocuments are present then read the previous reading info from there
* If MeasurementDocuments aren't there then read from the MeasuringPoint entitySet itself
* @param {IClientAPI} context
*/
export default function MeasuringPointDetailsEntitySet(context) {
    let binding = context.binding;
    
    if (libCom.isDefined(binding) &&
        libCom.isDefined(binding.MeasurementDocs) &&
        binding.MeasurementDocs.some(doc => ODataLibrary.hasAnyPendingChanges(doc))) {
        return `${context.binding['@odata.readLink']}/MeasurementDocs`;
    } else {
        return context.binding['@odata.readLink'];
    }
}
