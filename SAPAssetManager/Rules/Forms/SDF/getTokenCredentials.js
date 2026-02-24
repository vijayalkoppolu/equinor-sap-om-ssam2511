import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import { parseJWTToken } from '../../Common/Library/JWTTokenUtils';
import Logger from '../../Log/Logger';

const USER_ATTRIBUTE_CLAIM = 'xs.user.attributes';
const ROLE_COLLECTION_ATTRIBUTE = 'SDFRoleAttribute';
const USER_NAME_CLAIM = 'user_name';

/**
 * attempt to get the username and any existing roles from the stored xsuaa token
 * failure to identify/parse the token will result in empty credentials
 * {
 *    username: string | undefined,
 *    roles: array[string] | undefined,
 * }
 * 
 * @param {IClientAPI} context 
 * @returns {Promise<object>} the json object containing the username and roles
 */
export default async function getTokenCredentials(context) {
    const token = ApplicationSettings.getString(context, 'SDF_XSUAA_TOKEN', '');
    const result = {
        username: undefined,
        roles: undefined,
    };

    let payload = {};

    try {
        const parsedToken = await parseJWTToken(context, token);
        payload = parsedToken.payload;
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(),
            `Failed to decode SDF JWT token: ${error.message} ${error.toString()}. Continuing with empty credentials ${token}`);
        return result;
    }

    result.username = payload[USER_NAME_CLAIM];
    result.roles = payload[USER_ATTRIBUTE_CLAIM]?.[ROLE_COLLECTION_ATTRIBUTE];

    return result;
}

export { USER_ATTRIBUTE_CLAIM, ROLE_COLLECTION_ATTRIBUTE, USER_NAME_CLAIM };
