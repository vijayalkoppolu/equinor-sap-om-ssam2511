import updateOnlineXSUAATokenEntity from './updateOnlineXSUAATokenEntity';
import Logger from '../../Log/Logger';
import SDFIsFeatureEnabled from './SDFIsFeatureEnabled';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

/**
 * Sets the flush flag to true and updates the token in the online service
 * @param {*} context 
 * @returns true if there are no errors, false if there is an issue updating the token
 */
export default function InitialTransmit(context) {
    ApplicationSettings.setBoolean(context, 'SDFCacheFlush', true);
    if (SDFIsFeatureEnabled(context)) {
        return updateOnlineXSUAATokenEntity(context, '');
    } else {
        Logger.info('UserFeatures','SDF feature not enabled on the backend, skipping');
    }
    return Promise.resolve(true);
}
