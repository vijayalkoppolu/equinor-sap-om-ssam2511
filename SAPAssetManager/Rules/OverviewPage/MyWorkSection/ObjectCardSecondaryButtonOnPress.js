import libCom from '../../Common/Library/CommonLibrary';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import ObjectCardButtonOnPress from './ObjectCardButtonOnPress';

export default function ObjectCardSecondaryButtonOnPress(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding();
    libCom.setStateVariable(context, 'IsOnOperationBinding', binding);

    if (IsFSMS4SectionVisible(context)) {
        return ObjectCardButtonOnPress(context, binding, ['S', 'N'], true, 'N');
    }

    return ObjectCardButtonOnPress(context, binding, ['S', 'N']);
}
