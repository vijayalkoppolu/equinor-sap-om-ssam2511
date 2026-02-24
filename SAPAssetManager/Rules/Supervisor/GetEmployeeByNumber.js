export function GetEmployeeByNumber(personNum, context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `Employees('${personNum}')`, [], '')
    .then((employee) => {
        return employee.length ? employee.getItem(0)?.EmployeeName : personNum;
    })
    .catch(() => {
        return personNum;
    });
}
