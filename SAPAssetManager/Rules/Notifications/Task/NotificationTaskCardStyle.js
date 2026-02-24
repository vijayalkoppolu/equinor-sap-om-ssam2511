import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationTaskCardStyle(context) {
    const isReceived = libMobile.getMobileStatus(context.binding, context) ===
        libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());

    return isReceived ? 'ObjectCardSecondaryAction' : 'ObjectCardPrimaryAction';
}
