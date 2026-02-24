import ODataLibrary from '../../OData/ODataLibrary';

/**
 * Only local confirmations can be edited
 * @param {*} context 
 * @returns 
 */
export default function ConfirmationAllowEdit(context) {
    return ODataLibrary.isLocal(context.binding);
}
