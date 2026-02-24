import libCom from '../Common/Library/CommonLibrary';
/**
 * Generates filter properties for "My SubOperations".
 * @param {IClientAPI} context - The client API context.
 * @returns {Array} - An array of filter properties.
 */
export default function WorkOrderMySubOperationsFilter(context) {
    const retValue = getMySubOperationsFilterQuery(context);
    let filterProperties = [];

    if (retValue) {
        filterProperties.push({
            ReturnValue: retValue,
            DisplayValue: context.localizeText('my_suboperations'),
        });
    }

    return filterProperties;
}

/**
 * Constructs the filter query for suboperations based on user ID and personnel number.
 * @param {IClientAPI} context - The client API context.
 * @returns {string} - The constructed filter query string.
 */
export function getMySubOperationsFilterQuery(context, lambda = '') {
    const userId = libCom.getUserGuid(context);
    const personNo = libCom.getPersonnelNumber();
    let retValue = '';
    let prefix = '';
    if (lambda) {
        prefix = `${lambda}/`;
    }

    if (userId) {
        retValue += `(${prefix}SubOpMobileStatus_Nav/CreateUserGUID eq '${userId}' and ${prefix}SubOpMobileStatus_Nav/MobileStatus ne 'RECEIVED')`;
    }

    if (personNo) {
        if (retValue) {
            retValue += ' or ';
        }
        retValue += `${prefix}PersonNum eq '${personNo}'`;
    }

    return retValue;
}
