import libCom from '../../Common/Library/CommonLibrary';
import getBatch from '../IssueOrReceipt/GetBatch';
import ODataLibrary from '../../OData/ODataLibrary';

export default function IsBatchEditable(context) {
    let editable = true;
    let binding = context.binding;
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if ((movementType === 'R' || movementType === 'I') && (objectType === 'IB' || objectType === 'OB')) {
        editable = false;
    }
    if (binding) {
        let isLocal = ODataLibrary.isLocal(binding);
        if (!isLocal) {
            let batch = getBatch(context, binding);
            // If it is transfer, don't disable edit
            if (objectType !== 'TRF' && batch !== '') {
                editable = false;
            }
        }
    }

    return editable;
}
