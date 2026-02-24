import TechnicianFullName from './TechnicianFullName';
import SplitDuration from './SplitDuration';

/**
* Concatenate Technician Name and Allocated Work
* @param {IClientAPI} clientAPI
*/
export default function TechnicianHeadline(clientAPI) {
    let headline = '';
    const splitRecord = clientAPI.binding;

    const fullName = TechnicianFullName(clientAPI, splitRecord);
    headline += fullName || '';

    const allocatedWork = SplitDuration(clientAPI, splitRecord);
    headline += ` (${allocatedWork})`;

    return headline;
}
