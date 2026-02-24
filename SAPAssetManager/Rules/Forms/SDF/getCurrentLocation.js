import TrackingLib from '../../LocationTracking/LocationTrackingLibrary';
import locSvcMgr from '../../LocationTracking/Services/ServiceManager';
import Logger from '../../Log/Logger';

/**
 * Coordinate location
 * @typedef {Object} Coords
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 *  location object
 * @typedef {Object} Location
 * @property {Coords} coords
 */

/**
 * 
 * @param {IClientAPI} context
 * @returns {Promise<Location>}
 * @throws on failure
 */
export default function getCurrentLocation(context) {
    const locationManager = locSvcMgr.getInstance();
    const trackingAlreadyEnabled = locationManager.isTrackingEnabled();
    let enableTrackingPromise = Promise.resolve(true);
    if (!trackingAlreadyEnabled) {
        enableTrackingPromise = locationManager.enableTracking();
    }

    return enableTrackingPromise.then((trackingEnabled) => {
        if (!trackingEnabled) {
            throw new Error('Error: failed to enable location tracking');
        }
    }).then(() => {
        return TrackingLib.getCurrentLocation(context);
    }).then((currentLocation) => {
        if (typeof currentLocation !== 'object') {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `getCurrentLocation returned an invalid value: ${currentLocation}`);
            throw new Error('getCurrentLocation returned an invalid value');
        }
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), 'getCurrentLocation successfully retrieved the current location');
        const loc = { 
            coords: {
                latitude: currentLocation?.geometry?.coordinates?.[0]?.[0],
                longitude: currentLocation?.geometry?.coordinates?.[0]?.[1],
            },
        };
        const locjson = JSON.stringify(loc);
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), 'returning current location');
        return locjson;
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error attempting to get current location: ${error}`);
        throw error;
    }).finally(() => {
        if (!trackingAlreadyEnabled) {
            locationManager.disableTracking();
        }
    });
}
