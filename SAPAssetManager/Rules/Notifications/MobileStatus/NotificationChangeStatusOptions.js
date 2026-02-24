import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';

export default function NotificationChangeStatusOptions(context, actionBinding, rereadStatus = false) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Notification.global').getValue();
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, actionBinding, objectType);
        return StatusGeneratorWrapper.generateMobileStatusOptions(rereadStatus);
}
