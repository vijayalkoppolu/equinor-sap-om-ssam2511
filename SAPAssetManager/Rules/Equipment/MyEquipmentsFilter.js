/**
* Returns filter properties for "My Equipment" filter based on work orders, operations, and sub-operations.
* @param {IClientAPI} context
* @returns {Array} Array of filter properties
*/
import GetMyEquipFlocFilterQuery from '../Common/GetMyEquipFlocFilterQuery';

export default function MyEquipmentsFilter(context) {
    const retValue = getMyEquipmentFilterQuery(context);
    let filterProperties = [];

    if (retValue) {
        filterProperties.push({
            ReturnValue: retValue,
            DisplayValue: context.localizeText('my_equipment'),
        });
    }

    return filterProperties;
}

/**
 * Constructs the filter query for equip based on the user's work orders, operations, or sub-operations.
 * @returns {string} - The constructed filter query string.
 */
export function getMyEquipmentFilterQuery(context) {
    return GetMyEquipFlocFilterQuery(context);
}
