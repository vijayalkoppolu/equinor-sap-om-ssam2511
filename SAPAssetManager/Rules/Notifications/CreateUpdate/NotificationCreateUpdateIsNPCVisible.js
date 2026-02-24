import IsMinorWorkEnabled from '../../WorkOrders/IsMinorWorkEnabled';
import IsEmergencyWorkEnabled from '../../WorkOrders/IsEmergencyWorkEnabled';

export default async function NotificationCreateUpdateIsNPCVisible(context) {
    try {
        let count = await context.count('/SAPAssetManager/Services/AssetManager.service', 'NotificationProcessingContexts', '');
        return (count > 0 && (IsMinorWorkEnabled(context) || IsEmergencyWorkEnabled(context))); //One of the feature flags must be enabled
    } catch (err) {
        return false;
    }
}
