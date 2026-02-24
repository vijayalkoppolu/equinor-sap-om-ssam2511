/**
* Describe this function...
* @param {IClientAPI} context
*/
import GetMyEquipFlocFilterQuery from '../Common/GetMyEquipFlocFilterQuery';
export default function FunctionalLocationFilterByFilter(context) {
    const retValue = getMyFunctionalLocationsFilterQuery(context);
    let filterProperties = [];

    if (retValue) {
        filterProperties.push({
            ReturnValue: retValue,
            DisplayValue: context.localizeText('my_functional_locations'),
        });
    }

    return filterProperties;
}


/**
 * Constructs the filter query for flocs to show only those associated with the user's work orders, operations, or sub-operations.
 * @returns {string} - The constructed filter query string.
 */
export function getMyFunctionalLocationsFilterQuery(context) {
    return GetMyEquipFlocFilterQuery(context);
}
