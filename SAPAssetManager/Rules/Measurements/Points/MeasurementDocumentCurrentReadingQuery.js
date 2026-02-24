import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

/**
* Returns the query options for the Current Reading section
* @param {IClientAPI} context
*/
export default function MeasurementDocumentCurrentReadingQuery(context) {
    let binding = context.binding;
    if (libCom.isDefined(binding) &&
        libCom.isDefined(binding.MeasurementDocs) &&
        binding.MeasurementDocs.some(doc => ODataLibrary.hasAnyPendingChanges(doc))) {
        return '$filter=sap.hasPendingChanges()&$expand=MeasuringPoint&$orderby=ReadingTimestamp desc&$top=1';
    } else {
        return '';
    }

}
