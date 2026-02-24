import IsFSMS4CrewComponentEnabled from '../ComponentsEnablement/IsFSMS4CrewComponentEnabled';
import libCrew from './CrewLibrary';

export default function CrewSummaryNavWrapper(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    if (IsFSMS4CrewComponentEnabled(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Crew/FSMS4CrewNav.action');
    }

    let pageProxy = context;
    if (typeof pageProxy.getPageProxy === 'function') { 
        pageProxy = context.getPageProxy();
    }
    let actionContext = pageProxy.getActionBinding();

    return libCrew.initializeCrewHeader(context).then( function() { //Initialize today's crew
        pageProxy.setActionBinding(actionContext);  
        return pageProxy.executeAction('/SAPAssetManager/Actions/Crew/CrewSummaryNav.action');
    });
    
}
