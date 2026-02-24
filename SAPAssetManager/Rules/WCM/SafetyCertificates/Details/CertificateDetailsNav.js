import { AcyclicNavigate } from '../../Common/AcyclicNavigate';
import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function CertificateDetailsNav(context) {
    TelemetryLibrary.logPageEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/WCMSafetyCertificate.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_DETAIL);
    return AcyclicNavigate(context, 'SafetyCertificateDetailsPage', '/SAPAssetManager/Actions/WCM/SafetyCertificateDetailsNav.action', (prevBinding, currBinding) => prevBinding.WCMDocument === currBinding.WCMDocument, 2);
}
