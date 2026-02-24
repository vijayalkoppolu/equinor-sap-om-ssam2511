import libCom from '../../Common/Library/CommonLibrary';
import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function CompleteMobileStatusUpdateWrapper(context) {
    const binding = libCom.setBindingObject(context);
    const transitionText = binding['@odata.type'] === libCom.getGlobalDefinition(context, 'ODataTypes/Notification.global') ?
        context.localizeText('complete_notification') :
        context.localizeText('complete');

    return MobileStatusUpdateWrapper(context, transitionText);
}
