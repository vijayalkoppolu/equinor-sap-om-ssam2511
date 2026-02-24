import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import { Processes } from '../Common/EWMLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import { EWMProcessesPrefDefaultValue } from '../../UserPreferences/PersonalizationPreferences';

const TAB_ITEMS_MAPPING = {
    [Processes.Inbound]: {
        '_Name': 'InboundTab',
        'Caption': '$(L, inbound_tab)',
        'PageToOpen': '/SAPAssetManager/Pages/EWM/OverviewPage/InboundTab.page',
        '_Type': 'Control.Type.TabItem',
    },
    [Processes.Warehouse]: {
        '_Name': 'WarehouseTab',
        'Caption': '$(L, warehouse_tab)',
        'PageToOpen': '/SAPAssetManager/Pages/EWM/OverviewPage/WarehouseTab.page',
        '_Type': 'Control.Type.TabItem',
    },
};

export default async function OverviewTabItems(context) {
    const processesPref = PersonaLibrary.getEWMProcessesPreference(context) ||
        await PersonalizationPreferences.getEWMProcessesPreference(context) ||
        EWMProcessesPrefDefaultValue;

    return processesPref.map((process) => TAB_ITEMS_MAPPING[process] || null);
}
