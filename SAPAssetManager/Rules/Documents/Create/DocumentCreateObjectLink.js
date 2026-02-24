import DocLib from '../DocumentLibrary';
import commonLib from '../../Common/Library/CommonLibrary';

export default function DocumentCreateObjectLink(controlProxy) {
    const binding = commonLib.getPageName(controlProxy) === 'PDFControl' ? commonLib.getStateVariable(controlProxy, 'ServiceReportData') : controlProxy.binding;
    if (binding && binding['@odata.type'] === '#sap_mobile.MyNotificationHeader' && commonLib.getStateVariable(controlProxy, 'NotificationCategory')) {
        let value = commonLib.getAppParam(controlProxy,'DOCUMENT',commonLib.getStateVariable(controlProxy, 'NotificationCategory'));
        return value ? value : '';
    } else {
        controlProxy._context.binding = controlProxy.binding || binding;
        return DocLib.getObjectLink(controlProxy);
    }
}
