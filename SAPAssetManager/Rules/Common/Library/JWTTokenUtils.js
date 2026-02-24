import libBase64 from './Base64Library';
import isAndroid from '../IsAndroid';

export const JWTSECTIONS = {
    HEADER: 0,
    PAYLOAD: 1,
    SIGNATURE: 2,
};

/**
 * attempt to decode/parse a JWT token into its parts. no verification or validation is attempted
 * failures will throw an error
 * {
 *    header: json,
 *    payload: json,
 *    signature: Uint8Array,
 * }
 * 
 * @param {IClientAPI} context 
 * @param {string} token JWT token to parse
 * @returns {Promise<object>} the json object containing the parsed token parts
 * @throws
 */
export async function parseJWTToken(context, token) {
    const segments = token.split('.');
    if (segments.length !== Object.keys(JWTSECTIONS).length) {
        throw new Error(`invalid JWT token: not enough segments ${segments.length}`);
    }

    const decodePromises = segments.map(async (segment,idx) => {
        const paddedSegment = libBase64.addPadding(segment);
        const convertedSegment = libBase64.convertFromURLEncoding(paddedSegment);

        if (idx === JWTSECTIONS.SIGNATURE) {
            const decodedSegment = libBase64.transformBase64ToBinary(isAndroid(context), convertedSegment);
            return Promise.resolve(decodedSegment);
        }
        const decodedSegment = await libBase64.transformBase64ToString(isAndroid(context), convertedSegment);

        return decodedSegment;
    });

    const decodedSegments = await Promise.all(decodePromises);

    const decodedToken = {
        header: JSON.parse(decodedSegments[JWTSECTIONS.HEADER]),
        payload: JSON.parse(decodedSegments[JWTSECTIONS.PAYLOAD]),
        signature: decodedSegments[JWTSECTIONS.SIGNATURE],
    };
    return decodedToken;
}
