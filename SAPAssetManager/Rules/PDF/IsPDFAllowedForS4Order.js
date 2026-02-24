import IsServiceReportFeatureEnabled from './IsServiceReportFeatureEnabled';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function IsPDFAllowedForS4Order(clientAPI) {
    return IsServiceReportFeatureEnabled(clientAPI) && MobileStatusLibrary.isServiceOrderStatusChangeable(clientAPI);
}
