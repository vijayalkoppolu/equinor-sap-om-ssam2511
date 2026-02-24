import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import LoadPersonaOverview from '../Persona/LoadPersonaOverview';
import PersonaLibrary from '../Persona/PersonaLibrary';
import PersonalizationPreferences, { LayoutStyleValues } from './PersonalizationPreferences';
import isWindows from './../Common/IsWindows';
import { ProcessesPersonalizationMapping } from '../EWM/Common/EWMLibrary';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default async function UserPreferencesUpdate(context) {
    try {
        let resultPromise = context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');  // close the modal with cancel to clear all pending actions
        if (context.getControls() && context.getControls().length > 0) {
            const fcContainer = context.getControls()[0];
            const [tabs, kpi, layout, reading, checklists, filters, aiSwitch, serviceItems] = ['tabs', 'kpi', 'LayoutSeg', 'ReadingsScreenSeg', 'CheckListScreenSeg', 'FilterSwitch', 'AISwitch', 'ServiceItemsViewSeg'].map(controlName => fcContainer.getControl(controlName));
            if (reading) {
                await PersonalizationPreferences.setMeasuringPointView(context, CommonLibrary.getListPickerValue(reading.getValue()));
            }
            if (checklists) {
                await PersonalizationPreferences.setInspectionCharacteristicsView(context, CommonLibrary.getListPickerValue(checklists.getValue()));
            }
            if (filters) {
                await PersonalizationPreferences.setPersistFilterPreference(context, filters.getValue());
            }
            if (aiSwitch) {
                await PersonalizationPreferences.setAISwitchPreference(context, aiSwitch.getValue());
            }
            if (serviceItems) {
                await PersonalizationPreferences.setServiceItemsView(context, CommonLibrary.getListPickerValue(serviceItems.getValue()));
            }

            if (PersonaLibrary.isExtendedWarehouseClerk(context)) {
                const oldValueProcesses = await PersonalizationPreferences.getEWMProcessesPreference(context);
                const newValueProcesses = [];

                Object.entries(ProcessesPersonalizationMapping).forEach(([key, keyVal]) => {
                    if (fcContainer.getControl(key).getValue()) {
                        newValueProcesses.push(keyVal);
                    }
                });

                if (JSON.stringify(oldValueProcesses) !== JSON.stringify(newValueProcesses)) {
                    resultPromise = resultPromise
                        .then(() => PersonalizationPreferences.setEWMProcessesPreference(context, newValueProcesses))
                        .then(() => context.showActivityIndicator())
                        .then(activityIndicatorId => LoadPersonaOverview(context)
                            .then(() => context.dismissActivityIndicator(activityIndicatorId)));
                }
            }

            if (!isWindows(context)) {
                if (layout) {
                    await updateLayoutPreference(context, layout, tabs, kpi, resultPromise);
                }
            }
        }
        return resultPromise;
    } catch (error) {  // in case a sync fails halfway
        Logger.debug('USER PREFERENCES', error);
        return undefined;
    }
}

async function getSectionedTableOnOverviewPage(context) {
    const overviewPageName = PersonaLibrary.getPersonaOverviewStateVariablePage(context);
    const overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
    return overviewPage?.getControls()?.find(c => c.getType() === 'Control.Type.SectionedTable');
}

async function getTabControlOnOverviewPage(context) {
    const overviewPageName = PersonaLibrary.getPersonaOverviewStateVariablePage(context);
    const overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
    return overviewPage?.getControls()?.find(c => c.getType() === 'Control.Type.Tabs');
}

async function updateLayoutPreference(context, layout, tabs, kpi, resultPromise) {
    const oldValue = await PersonalizationPreferences.getLayoutStylePreference(context);
    const newValue = CommonLibrary.getListPickerValue(layout.getValue());
    if (oldValue !== newValue) {
        TelemetryLibrary.logSystemEvent(context, 
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/User.global').getValue(), 
            TelemetryLibrary.SYSTEM_TYPE_PREF_HOMELAYOUT,
            `${PersonaLibrary.getActivePersonaCode(context)}.${newValue}`);
        if (newValue === LayoutStyleValues.Tab) {
            const newKpi = kpi.getValue();
            const newTabs = tabs.getValue().map(item => item.ReturnValue).join(','); // comma separated string
            handleTabLayout(context, newValue, newKpi, newTabs, resultPromise);
        } else {
            handleNonTabLayout(context, newValue, resultPromise);
        }
     } else if (newValue === LayoutStyleValues.Tab)  {
        const oldTabs = await PersonalizationPreferences.getOverviewPageTabs(context);
        const newTabs = tabs.getValue().map(item => item.ReturnValue).join(','); // comma separated string
       // if (!arraysAreEqual(oldTabs, newTabs)) {
       if (oldTabs !== newTabs) {
            const newKpi = kpi.getValue();
            handleSelectedTabs(context, newTabs, newKpi, resultPromise);
        } else {
            if (kpi) {
                const oldKpi = await PersonalizationPreferences.getOverviewPageKPIPreference(context);
                const newKpi = kpi.getValue();
                if (oldKpi !== newKpi) {
                    handleKpiHeader(context, newKpi, resultPromise);
                }
            }
        }
     }
}

function handleTabLayout(context, newValue, newKpi, tabs, resultPromise) {
    resultPromise
    .then(() => PersonalizationPreferences.setLayoutStylePreference(context, newValue))
    .then(() => PersonalizationPreferences.setOverviewPageTabs(context, tabs))
    .then(() => PersonalizationPreferences.setOverviewPageKPIPreference(context, newKpi))
    .then(() => context.showActivityIndicator(context.localizeText('switching_home_screen_layout')))
    .then(activityIndicatorId => LoadPersonaOverview(context)
        .then(() => context.dismissActivityIndicator(activityIndicatorId)))
    .then(() => getTabControlOnOverviewPage(context))
    .then(tabControl => tabControl?.redraw());  // Reload the sectioned table on the persona overview
}

function handleNonTabLayout(context, newValue, resultPromise) {
    resultPromise
    .then(() => PersonalizationPreferences.setLayoutStylePreference(context, newValue))
    .then(() => context.showActivityIndicator(context.localizeText('switching_home_screen_layout')))
    .then(activityIndicatorId => LoadPersonaOverview(context)
        .then(() => context.dismissActivityIndicator(activityIndicatorId)))
    .then(() => getSectionedTableOnOverviewPage(context))
    .then(sectionedTable => sectionedTable?.redraw());  // Reload the sectioned table on the persona overview
}

function handleSelectedTabs(context, newTabs, newKpi, resultPromise) {
    resultPromise
    .then(() => PersonalizationPreferences.setOverviewPageTabs(context, newTabs))
    .then(() => PersonalizationPreferences.setOverviewPageKPIPreference(context, newKpi))
    .then(() => context.showActivityIndicator(context.localizeText('switching_home_screen_layout')))
    .then(activityIndicatorId => LoadPersonaOverview(context)
        .then(() => context.dismissActivityIndicator(activityIndicatorId)))
    .then(() => getTabControlOnOverviewPage(context))
    .then(tabControl => tabControl?.redraw());  // Reload the sectioned table on the persona overview
}

function handleKpiHeader(context, newKpi, resultPromise) {
    resultPromise
    .then(() => PersonalizationPreferences.setOverviewPageKPIPreference(context, newKpi))
    .then(() => context.showActivityIndicator(context.localizeText('switching_home_screen_layout')))
    .then(activityIndicatorId => LoadPersonaOverview(context)
    .then(() => context.dismissActivityIndicator(activityIndicatorId)))
    .then(() => getTabControlOnOverviewPage(context))
    .then(tabControl => tabControl?.redraw());  // Reload the sectioned table on the persona overview
}
