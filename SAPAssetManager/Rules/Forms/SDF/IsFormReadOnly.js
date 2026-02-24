import libCommon from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';

const CERTIFICATE_OBJECT_TYPE = 'WCM_DOCUMENT';
const WORK_PERMIT_OBJECT_TYPE = 'WCM_APPLICATION';

/**
* @param {IClientAPI} clientAPI
* @returns {Promise<boolean>}
*/
export default function IsFormReadOnly(clientAPI, binding = clientAPI.binding) {
    // For ST persona only Work Permit and Certificate forms are editable
    if (libPersona.isWCMOperator(clientAPI) && binding.ObjectType !== CERTIFICATE_OBJECT_TYPE && binding.ObjectType !== WORK_PERMIT_OBJECT_TYPE) {
        return Promise.resolve(true);
    }

    // Forms related to Certificate or Work Permit in Closed status are read-only regardless of persona
    if (binding.ObjectType === CERTIFICATE_OBJECT_TYPE || binding.ObjectType === WORK_PERMIT_OBJECT_TYPE) {
        const systemStatusClosedCode = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Closed.global').getValue();
        const filterConditionsWCM = `WCMApplication_Nav/ActualSystemStatus eq '${systemStatusClosedCode}' or WCMDocumentHeader_Nav/ActualSystemStatus eq '${systemStatusClosedCode}'`;

        return checkLinkedObjectByConditionsExists(clientAPI, binding, filterConditionsWCM);
    }


    // only readonly for mandatory forms that are completed and also have a parent object that is completed
    if (binding.DynamicFormInstance_Nav.Mandatory !== 'X'
        || (binding.DynamicFormInstance_Nav.FormStatus !== 'Completed'
            && binding.DynamicFormInstance_Nav.FormStatus !== 'Final')) {
        return Promise.resolve(false);
    }

    const WOCompletedMobileStatus = libCommon.getAppParam(clientAPI, 'MOBILESTATUS', clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    const filterConditions = `MyWorkOrderHeader_Nav/OrderMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}' ` +
        `or MyWorkOrderOperation_Nav/OperationMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}' ` +
        `or MyWorkOrderSubOperation_Nav/SubOpMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}' ` +
        `or MyNotificationHeader_Nav/NotifMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}'`;

    return checkLinkedObjectByConditionsExists(clientAPI, binding, filterConditions);
}

function checkLinkedObjectByConditionsExists(clientAPI, binding, conditions) {
    return clientAPI.count(
        '/SAPAssetManager/Services/AssetManager.service',
        'DynamicFormLinkages',
        `$filter=FormInstanceID eq '${binding.FormInstanceID}' and (${conditions})`,
    ).then((count) => count > 0);
}
