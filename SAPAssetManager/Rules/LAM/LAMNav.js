import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import GetLAM from './GetLAM';
import LAMReadLink from './LAMReadLink';
import LAMFilter from './LAMFilter';

export default async function LAMNav(context) {
    const pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();

    let lam = await GetLAM(context, LAMReadLink(context, actionContext), [], LAMFilter(context, actionContext));
    if (lam) {
        //Rebind the LAM data
        pageProxy.setActionBinding(lam);
        return TelemetryLibrary.executeActionWithLogPageEvent(context,
            '/SAPAssetManager/Actions/LAM/LAMDetailsNav.action',
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/LAM.global').getValue(),
            TelemetryLibrary.PAGE_TYPE_DETAIL);
    }

    return Promise.resolve();
}
