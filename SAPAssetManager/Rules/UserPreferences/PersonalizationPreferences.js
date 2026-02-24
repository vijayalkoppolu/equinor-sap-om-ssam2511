import isWindows from '../Common/IsWindows';
import CommonLibrary from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import { GlobalVar as GlobalClass } from '../Common/Library/GlobalCommon';
import Logger from '../Log/Logger';
import { Processes } from '../EWM/Common/EWMLibrary';

export const LayoutStyleValues = Object.freeze({
    New: 'new',
    Classic: 'classic',
    Tab: 'tab',
});

export const EWMProcessesPrefDefaultValue = [Processes.Inbound, Processes.Warehouse];

export default class PersonalizationPreferences {
    /**
    * check if measuring point is a classical view
    */
    static async isMeasuringPointListView(context) {
        return isWindows(context) || (1 === await this.getMeasuringPointView(context));
    }

    /**
    * check if inspection characteristics is a classical view
    * @returns {Promise<boolean>}
    */
    static async isInspectionCharacteristicsListView(context) {
        return isWindows(context) || (1 === await this.getInspectionCharacteristicsView(context));
    }

    /**
    * check if service items view preference is set to table
    * @returns {Promise<boolean>}
    */
    static isServiceItemTableView(context) {
        return this.getServiceItemsView(context)
            .then(v => v === 0);
    }

    /**
    * check if service items view preference is set to list
    * @returns {Promise<boolean>}
    */
    static isServiceItemListView(context) {
        return this.getServiceItemsView(context)
            .then(v => v === 1);
    }

    static async isNewHomeScreenEnabled(context) {
        return await this.getLayoutStylePreference(context) === LayoutStyleValues.New;
    }

    static async isClassicHomeScreenEnabled(context) {
        return await this.getLayoutStylePreference(context) === LayoutStyleValues.Classic;
    }

    /**
    * set measuring point view
    */
    static setMeasuringPointView(context, value) {
        return savePreference(context, prefGrp(context), 'MeasuringPointView', value);
    }

    /*
    * set inspection characteristics view
    */
    static setInspectionCharacteristicsView(context, value) {
        return savePreference(context, prefGrp(context), 'InspectionCharacteristicView', value);
    }

    /*
    * set service items view
    */
    static setServiceItemsView(context, value) {
        return savePreference(context, prefGrp(context), 'ServiceItemsView', value);
    }

    /*
    * set inspection characteristics view
    */
    static setPersistFilterPreference(context, value) {
        return savePreference(context, prefGrp(context), 'PersistFilter', value);
    }

    /*
    * set overvview page tabs view
    * @param {IClientAPI} context
    * @param {string} value - Comma separated tab identifiers to be saved as a preference
    */
     static setOverviewPageTabs(context, value) {
        return savePreference(context, prefGrp(context), `${PersonaLibrary.getActivePersona(context)}_OverviewPageTabs`, value);
    }

    /*
    * get overvview page tabs view
    */
    static getOverviewPageTabs(context) {
        return readPreference(context, prefGrp(context), `${PersonaLibrary.getActivePersona(context)}_OverviewPageTabs`)
        .then(tabString => {
            try {
                if (ValidationLibrary.evalIsEmpty(tabString)) {
                    return [];
                }     
                return tabString.split(',');
              } catch (error) {
                console.error('Invalid JSON string:', error);
                return [];
              }
        });    
    }

    static setOverviewPageKPIPreference(context, value) {
        return savePreference(context, prefGrp(context), `${PersonaLibrary.getActivePersona(context)}_OverviewPageKPI`, value);
    }

    static getOverviewPageKPIPreference(context) {
        return readPreference(context, prefGrp(context), `${PersonaLibrary.getActivePersona(context)}_OverviewPageKPI`)
            .then(kpiVisible => getBoolOrDefault(kpiVisible, true));
    }
      

     /*
    * set AI Job Completion preference
    */
     static setAISwitchPreference(context, value) {
        return savePreference(context, prefGrp(context), 'AIJobCompletion', value);
    }

    /**
    * set EWM Processes preference
    * @returns {Promise}
    */
    static setEWMProcessesPreference(context, value) {
        return savePreference(context, prefGrp(context), 'EWMProcesses', value)
            .then(() => cacheEWMProcessesPreference(context));
    }

    /** @param {'new'|'classic' |'tab'} value  */
    static setLayoutStylePreference(context, value) {
        return savePreference(context, prefGrp(context), `${PersonaLibrary.getActivePersona(context)}_LayoutStylePreference`, value)
            .then(() => cacheLayoutStylePreference(context));
    }

    /**
    * get measuring point view
    */
    static getMeasuringPointView(context) {
        return readPreference(context, prefGrp(context), 'MeasuringPointView')
            .then(measuringPointView => getNumberOrDefault(measuringPointView, 0));
    }

    /**
    * get inspection characteristics view
    * @returns {Promise<number>}
    */
    static getInspectionCharacteristicsView(context) {
        return readPreference(context, prefGrp(context), 'InspectionCharacteristicView')
            .then(inspectionCharacteristicView => getNumberOrDefault(inspectionCharacteristicView, 0));
    }

    /**
    * get service items view
    * @returns {Promise<number>}
    */
    static getServiceItemsView(context) {
        return readPreference(context, prefGrp(context), 'ServiceItemsView')
            .then(serviceItemsView => getNumberOrDefault(serviceItemsView, 0));
    }

    /**
    * get current Persist Filter preference
    */
    static getPersistFilterPreference(context) {
        return readPreference(context, prefGrp(context), 'PersistFilter')
            .then(persistFilter => getBoolOrDefault(persistFilter, true));
    }
    /**
    * get current AI Job Completion preference
    */
    static getAIJobCompletionPreference(context) {
        return readPreference(context, prefGrp(context), 'AIJobCompletion')
            .then(aiJobCompletionVisible => getBoolOrDefault(aiJobCompletionVisible, true));
    }

    /**
    * get current delta sync preference
    */
    static getDeltaSyncPreference(context, prefName, defaultValue) {
        try {
            const prefGroup = deltaSyncPrefGrp(context);
            if (ValidationLibrary.evalIsEmpty(GlobalClass.getDeltaSyncUserPreferenceInfo()[prefGroup]) || ValidationLibrary.evalIsEmpty(GlobalClass.getDeltaSyncUserPreferenceInfo()[prefGroup][prefName])) {
                return defaultValue || false;
            }
            return GlobalClass.getDeltaSyncUserPreferenceInfo()[prefGroup][prefName];
        } catch (exc) {
            Logger.error('getDeltaSyncPreference', `${deltaSyncPrefGrp(context)} ${prefName} was not set on the device configuration`);
            return defaultValue || false;
        }
    }

    /**
    * set current delta sync preference
    */
    static setDeltaSyncPreference(context, prefName, value) {
        const prefGroup = deltaSyncPrefGrp(context);
        return savePreference(context, prefGroup, prefName, value).then(() => {
            let params = GlobalClass.getDeltaSyncUserPreferenceInfo();
            const resultProxy = CommonLibrary.defaultObject(params, () => ({}));
            resultProxy[prefGroup][prefName] = value;
            GlobalClass.setDeltaSyncUserPreferenceInfo(params);
        });
    }
    /**
    * @returns {Promise<'new'|'classic'>}
    */
    static getLayoutStylePreference(context) {
        return readPreference(context, prefGrp(context), `${PersonaLibrary.getActivePersona(context)}_LayoutStylePreference`);
    }

    static async getManualUpload(context, prefName) {
        return await this.getDeltaSyncPreference(context, prefName);
    }

    static getEWMProcessesPreference(context) {
        return readPreference(context, prefGrp(context), 'EWMProcesses');
    }
}

function getNumberOrDefault(numberlike, defaultValue) {
    return (numberlike === null || numberlike === undefined) ? defaultValue : Number.parseInt(numberlike);
}

function getBoolOrDefault(boolLike, defaultValue) {
    return (boolLike === null || boolLike === undefined) ? defaultValue : boolLike;
}

/**
 * @param {IClientAPI} context
 * @param {{'MeasuringPointView'|'InspectionCharacteristicView'|'ServiceItemsView'|'PersistFilter'}} preferenceName
 * @param {string} preferenceValue
 * @returns {Promise}
 */
function savePreference(context, preferenceGroup, preferenceName, preferenceValue) {
    preferenceValue = JSON.stringify(preferenceValue);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], `$filter=PreferenceGroup eq '${preferenceGroup}' and UserGuid eq '${CommonLibrary.getUserGuid(context)}' and PreferenceName eq '${preferenceName}'`)
        .then(items => 0 < items.length ? updatePersonalizationPreference(context, preferenceValue, items.getItem(0)['@odata.readLink']) : createPersonalizationPreference(context, preferenceGroup, preferenceName, preferenceValue));
}

function createPersonalizationPreference(context, preferenceGroup, preferenceName, preferenceValue) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target':
            {
                'EntitySet': 'UserPreferences',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties':
            {
                'UserGuid': CommonLibrary.getUserGuid(context),
                'RecordId': CommonLibrary.GenerateOfflineEntityId(),
                'PreferenceGroup': preferenceGroup,
                'PreferenceName': preferenceName,
                'PreferenceValue': preferenceValue,
            },
        },
    });
}

function updatePersonalizationPreference(context, preferenceValue, readLink) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        'Properties': {
            'Target':
            {
                'EntitySet': 'UserPreferences',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': readLink,
            },
            'Properties':
            {
                'PreferenceValue': preferenceValue,
            },
        },
    });
}

function prefGrp(context) {
    return context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/PersonalizationPreferenceGroup.global').getValue();
}

function deltaSyncPrefGrp(context) {
    return context.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/DeltaSync/DeltaSyncPersonalizationPreferenceGroup.global').getValue();
}

/**
 * @param {IClientAPI} context
 * @param {'MeasuringPointView'|'InspectionCharacteristicView'|'ServiceItemsView'|'PersistFilter'} prefName
 * @returns {Promise<string|undefined>}
 */
function readPreference(context, prefGroup, prefName) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], `$filter=PreferenceGroup eq '${prefGroup}' and UserGuid eq '${CommonLibrary.getUserGuid(context)}' and PreferenceName eq '${prefName}'`)
        .then((/** @type {ObservableArray<UserPreference>} */ preferences) => 
            ValidationLibrary.evalIsEmpty(preferences) ? undefined : JSON.parse(preferences.getItem(0).PreferenceValue,
        )).catch((error) => {
            Logger.error('readPreference', `Error reading preference '${prefGroup}' '${prefName}': ${error}`);
            return undefined;
        });
}

export function cacheLayoutStylePreference(context) {
    const stateVars = CommonLibrary.getGlobalStateVariables(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], `$filter=PreferenceGroup eq '${prefGrp(context)}' and endswith(PreferenceName,'_LayoutStylePreference')`)
        .then(layoutPrefs => layoutPrefs
            .forEach((/** @type {UserPreference} */ pref) => stateVars[`${prefGrp(context)}_${pref.UserGuid}_${pref.PreferenceName}`] = JSON.parse(pref.PreferenceValue)));
}

export function getLayoutPreferenceCacheKey(context) {
    return `${prefGrp(context)}_${CommonLibrary.getUserGuid(context)}_${PersonaLibrary.getActivePersona(context)}_LayoutStylePreference`;
}

export function getEWMProcessesPreferenceCacheKey(context) {
    return `${prefGrp(context)}_${CommonLibrary.getUserGuid(context)}_EWMProcesses`;
}

export function cacheEWMProcessesPreference(context) {
    if (!PersonaLibrary.isExtendedWarehouseClerk(context)) {
        // EWM Processes preference is applicable only for Extended Warehouse Clerk persona
        return Promise.resolve();
    }

    const stateVars = CommonLibrary.getGlobalStateVariables(context);
    return PersonalizationPreferences.getEWMProcessesPreference(context).then(result => {
        stateVars[getEWMProcessesPreferenceCacheKey(context)] = result || EWMProcessesPrefDefaultValue;
        return Promise.resolve();
    });
}
