import ODataLibrary from '../OData/ODataLibrary';
import NotificationMobileStatusGenerator from './NotificationMobileStatusGenerator';

/**
 * @typedef {import('./MobileStatusGenerator').StatusOverride} StatusOverride
 */

export default class PhaseModelNotificationMobileStatusGenerator extends NotificationMobileStatusGenerator {

    /**
     * 
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {MyNotificationHeader} binding 
     * @param {PMMobileStatus} currentStatus 
     * @param {string} objectType 
     */
    constructor(context, binding, currentStatus, objectType) {
        super(context, binding, currentStatus, objectType);
    }

    /**
     * Get override for Completed status.
     * @returns {StatusOverride}
     */
    _getCompletedStatusOverrideProperties() {
        const baseOverride = super._getCompletedStatusOverrideProperties();
        return {
            ...baseOverride,
            Enabled: true,
        };
    }

    /**
     * Returns if status can be changed or not
     * @returns {boolean}
     */
    _areStatusOptionsVisible() {
        const visibility = super._areStatusOptionsVisible();

        if (visibility && this._binding) {
            const isLocal = ODataLibrary.isLocal(this._binding);
            const emergencyNotificationType = '01';
            const isEmergency = this._binding.NotifProcessingContext === emergencyNotificationType;

            if (isLocal && isEmergency) return false;
        }

        return visibility;
    }
}
