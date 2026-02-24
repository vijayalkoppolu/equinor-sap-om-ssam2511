import libCom from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function WorkOrderMyWorkordersFilter(context) {
    const isFST = libPersona.isFieldServiceTechnician(context);

    let displayValue = isFST ? context.localizeText('my_serviceorders') : context.localizeText('my_workorders');

    const retValue = getMyWorkOrdersFilterQuery(context);
    let filterProperties = [];

    if (retValue) {
        filterProperties.push({
            ReturnValue: retValue,
            DisplayValue: displayValue,
        });
    }

    return filterProperties;

}

/**
 * Constructs the filter query for work orders based on user ID and personnel number.
 * @param {IClientAPI} context - The client API context.
 * @returns {string} - The constructed filter query string.
 */
export function getMyWorkOrdersFilterQuery(context, lambda = '') {
    const userId = libCom.getUserGuid(context);
    let retValue = '';
    let prefix = '';
    if (lambda) {
        prefix = `${lambda}/`;
    }

    if (userId) {
        retValue += `(${prefix}OrderMobileStatus_Nav/CreateUserGUID eq '${userId}' and ${prefix}OrderMobileStatus_Nav/MobileStatus ne 'RECEIVED')`;
    }

    if (retValue) {
        retValue += ' or ';
    }
    retValue += getAssignToFilterQuery(prefix);
    return retValue;
}

export function getAssignToFilterQuery(prefix) {
    let personnelNum = libCom.getPersonnelNumber();
    const PARENT_FUNCTION_TYPE = 'VW';
    if (!personnelNum) {
        return `not sap.entityexists(WOPartners) or ${prefix}WOPartners/all(w: w/PartnerFunction ne '${PARENT_FUNCTION_TYPE}')`;        
    }
    return `${prefix}WOPartners/any(wp : wp/PartnerFunction eq '${PARENT_FUNCTION_TYPE}' and wp/PersonnelNum eq '${personnelNum}')`;
}
