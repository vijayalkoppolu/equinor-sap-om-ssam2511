/**
 * Determines whether to show the switch persona picker or not.
 * @param {*} context - The app context.
 * @returns {Promise<boolean>} Resolves to true if there are user personas, otherwise false.
 */
import Logger from '../Log/Logger';

export default function ShowUserPersonas(context) {
    const userPersonaLogCategory = context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserPersona.global').getValue();

    return context
        .count('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '')
        .then(count => count > 0)
        .catch(error => {
            Logger.error(userPersonaLogCategory, `ShowUserPersonas error: ${error}`);
            return false;
        });
}
