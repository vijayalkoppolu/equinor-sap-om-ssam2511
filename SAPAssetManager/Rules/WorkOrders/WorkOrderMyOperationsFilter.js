import libCom from '../Common/Library/CommonLibrary';
/**
 * Generates filter properties for "My Operations".
 * @param {IClientAPI} context - The client API context.
 * @returns {Array} - An array of filter properties.
 */
export default function WorkOrderMyOperationsFilter(context) {
    const retValue = getMyOperationsFilterQuery(context);
    let filterProperties = [];

    if (retValue) {
        filterProperties.push({
            ReturnValue: retValue,
            DisplayValue: context.localizeText('my_operations'),
        });
    }

    return filterProperties;
}

/**
 * Constructs the filter query for operations based on user ID and personnel number.
 * @param {IClientAPI} context - The client API context.
 * @returns {string} - The constructed filter query string.
 */
export function getMyOperationsFilterQuery(context, lambda = '') {
    const userId = libCom.getUserGuid(context);
    const personNo = libCom.getPersonnelNumber();
    let retValue = '';
    let prefix = '';
    if (lambda) {
        prefix = `${lambda}/`;
    }

    if (userId) {
        retValue += `(${prefix}OperationMobileStatus_Nav/CreateUserGUID eq '${userId}' and ${prefix}OperationMobileStatus_Nav/MobileStatus ne 'RECEIVED')`;
    }

    if (personNo) {
        if (retValue) {
            retValue += ' or ';
        }
        retValue += `${prefix}PersonNum eq '${personNo}'`;
        retValue += ` or ${prefix}MyWorkOrderOperationCapacityRequirement_/any(cp: cp/PersonnelNo eq '${personNo}')`;
    }

    return retValue;
}
