import IsAndroid from '../Common/IsAndroid';
import OnDateChanged from '../Common/OnDateChanged';
import libPersona from '../Persona/PersonaLibrary';
import libAnalytics from '../Extensions/EventLoggers/Analytics/AnalyticsLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function OverviewOnPageReturning(context) {
    if (!libCommon.isApplicationLaunch(context)) {
        Logger.debug('OverviewOnPageReturning', 'App Launch is not complete, skipping app launch analytics');
        return;
    }

    if (libPersona.isMaintenanceTechnician(context)) {
        redrawQAB(context);

        // Refresh the map view
        let sectionedTable = context.getControls()[0];
        let mapSection = sectionedTable.getSection('MapExtensionSection');

        if (mapSection) {
            let mapViewExtension = mapSection.getExtension();
            if (IsAndroid(context)) {
                mapSection.redraw(true);
            } else if (mapViewExtension) {
                mapViewExtension.update();
            }
        }

        // Refresh the High Priority Work Orders
        sectionedTable.getSection('HighPriorityOrdersSection')?.redraw();

        // Check to see if this date has changed
        let lastDateChange = context.getClientData().lastDateChange;
        let now = new Date();

        if (lastDateChange.getDate() !== now.getDate() && now > lastDateChange) {
            OnDateChanged(context);
        }
        //trigger analytics event for MT Return to Overview Page
        libAnalytics.maintenanceTechnicaionReturnOverview();

    } else if (libPersona.isMaintenanceTechnicianStd(context)) {
        //trigger analytics event for MT STD Return to Overview Page
        libAnalytics.maintenanceTechnicaionStdReturnOverview();

    } else if (libPersona.isInventoryClerk(context)) {
        //trigger analytics event for IM Return to Overview Page
        libAnalytics.inventoryManagerReturnOverview();

    } else if (libPersona.isFieldServiceTechnicianPro(context)) {
        //trigger analytics event for FST Pro Return to Overview Page
        libAnalytics.fieldServiceTechnicaionProReturnOverview();

    } else if (libPersona.isFieldServiceTechnician(context)) {
        //trigger analytics event for FST Return to Overview Page
        libAnalytics.fieldServiceTechnicaionReturnOverview();

    } else if (libPersona.isWCMOperator(context)) {
        //trigger analytics event for ST/WCM Return to Overview Page
        libAnalytics.safetyTechnicaionReturnOverview();
    }
}

function redrawQAB(context, sectionedTable = context.getControls()[0]) {
    try {
        const QABExtension = context.getClientData().QABSettingsInstance.getExtension();
        if (!QABExtension) {
            const QABSection = sectionedTable.getSection('QuickActionBarExtensionSection');
            if (QABSection) {
                QABSection.redraw(true);
            }
        }
    } catch (error) {
        Logger.error('redrawQAB', error);
    }
}
