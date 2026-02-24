import IsServiceReportFeatureEnabled from './IsServiceReportFeatureEnabled';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function IsPDFAllowedForS4Item(clientAPI) {
    return IsServiceReportFeatureEnabled(clientAPI) && MobileStatusLibrary.isServiceItemStatusChangeable(clientAPI);
}
