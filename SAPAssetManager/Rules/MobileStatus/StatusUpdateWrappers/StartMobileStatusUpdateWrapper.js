import libCICO from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function StartMobileStatusUpdateWrapper(context) {
    const binding = libCom.setBindingObject(context);
    const transitionText = context.localizeText(getStartTranslationKey(context, binding));

    return MobileStatusUpdateWrapper(context, transitionText);
}

function getStartTranslationKey(context, binding) {
    switch (binding['@odata.type']) {
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrder.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderOperation.global'): {
            if (libCICO.isCICOEnabled(context)) {
                return 'clock_in';
            }
            return 'start';
        }
        case libCom.getGlobalDefinition(context, 'ODataTypes/Notification.global'):
            return 'start_notification';
        default:
            return 'start';
    }
}
