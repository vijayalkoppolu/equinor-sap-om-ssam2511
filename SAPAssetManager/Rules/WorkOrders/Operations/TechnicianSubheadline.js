/**
* The splits will show the following depending on the status:
* - If the status is Completed then show Completed
* - If the status is Started or Hold then show In Progress
* - If the status is neither of the above then show Open
* @param {IClientAPI} clientAPI
*/

import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function TechnicianSubheadline(clientAPI) {
    const splitRecord = clientAPI.binding;
    const status = splitRecord?.PMMobileStatus_Nav?.MobileStatus || '';

    if (!status) {
        return '';
    }

    const completedStatus = CommonLibrary.getAppParam(clientAPI, 'MOBILESTATUS', clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const startedStatus = CommonLibrary.getAppParam(clientAPI, 'MOBILESTATUS', clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const holdStatus = CommonLibrary.getAppParam(clientAPI, 'MOBILESTATUS', clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

    if (status === completedStatus) {
        return clientAPI.localizeText('kpi_completed');
    } else if (status === startedStatus || status === holdStatus) {
        return clientAPI.localizeText('kpi_in_progress');
    } else {
        return clientAPI.localizeText('kpi_open');
    }
}
