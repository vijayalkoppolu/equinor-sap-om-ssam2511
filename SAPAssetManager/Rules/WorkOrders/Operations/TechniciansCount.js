import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function TechniciansCount(clientAPI, operation = clientAPI.getPageProxy().binding) {

    if (operation) {
        return CommonLibrary.getEntitySetCount(clientAPI, operation['@odata.readLink'] + '/MyWorkOrderOperationCapacityRequirement_', '');
    } else {
        return 0;
    }
 }
