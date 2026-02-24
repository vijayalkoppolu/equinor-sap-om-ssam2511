
export default function TechnicianActivityItems(clientAPI) {
    const items = [];

    let employeeCommunications = clientAPI.getBindingObject().Employee_Nav.EmployeeCommunications_Nav;

    //communication email type is '0010'
    let email = employeeCommunications.find(comm => comm.CommunicationType === '0010');
    if (email) {
        items.push({
            'ActivityType': 'Email',
            'ActivityValue': email.Value,
        });
    }

    //communication phone type is '0020'
    let phone = employeeCommunications.find(comm => comm.CommunicationType === '0020');
    if (phone) {
        items.push({
            'ActivityType': 'Phone',
            'ActivityValue': phone.Value,
        });

        items.push({
            'ActivityType': 'Message',
            'ActivityValue': phone.Value,
        });
    }

    return items;
}
