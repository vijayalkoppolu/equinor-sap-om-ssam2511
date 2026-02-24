/**
* Generate a random number as a hex string
* - nativescript's getRandomNumbers implementation on ios appears to be broken.
*   getting random values from uuid generation which seems to work for now
* @param {Object} clientAPI
* @param {number} length number of hex digits to output. defaults to 40 if omitted
*/
// eslint-disable-next-line no-unused-vars
export default function FormInstanceCreateLocalId(clientAPI, length = 40) {
    let result = '';
    while (result.length < length) {
        result += getRandomHexStringFromUUID();
    }

    return result.substring(0, length);
}

const uuidregex = /^([a-f0-9]{8})-([a-f0-9]{4})-[a-f0-9]([a-f0-9]{3})-[a-f0-9]([a-f0-9]{3})-([a-f0-9]{12})$/;
/**
 * gets a v4 uuid and removes non-random hex digits from it
 * @returns {string} hex string of 30 random hex characters
 */
function getRandomHexStringFromUUID() {
    const results = crypto.randomUUID().match(uuidregex);
    return results[1] + results[2] + results[3] + results[4] + results[5];
}
