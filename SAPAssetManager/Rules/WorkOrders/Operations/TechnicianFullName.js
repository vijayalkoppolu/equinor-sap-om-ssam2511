/**
* Returns the full name of the technician
* @param {IClientAPI} clientAPI
*/
export default function TechnicianFullName(clientAPI, binding) {
    const splitRecord = binding || clientAPI.binding;

    const firstName = splitRecord?.Employee_Nav?.FirstName || '';
    const lastName = splitRecord?.Employee_Nav?.LastName || '';

    return firstName ? `${firstName} ${lastName}` : lastName;
}
