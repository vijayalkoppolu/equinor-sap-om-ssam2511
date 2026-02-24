import { TelemetryEventLogger } from 'extension-SAMFoundation';
import Logger from '../../../Log/Logger';
import libCom from '../../../Common/Library/CommonLibrary';

export default class TelemetryLibrary {
    /**
     * Event Types
     */
    static get EVENT_TYPE_CREATE() {
        return 'create';
    }
    static get EVENT_TYPE_START() {
        return 'start';
    }
    static get EVENT_TYPE_VIEW() {
        return 'view';
    }
    static get EVENT_TYPE_UPDATE() {
        return 'update';
    }
    static get EVENT_TYPE_COMPLETE() {
        return 'complete';
    }
    static get EVENT_TYPE_UPLOAD() {
        return 'upload';
    }
    static get EVENT_TYPE_DOWNLOAD() {
        return 'download';
    }
    static get EVENT_TYPE_OPEN() {
        return 'open';
    }
    static get EVENT_TYPE_RESET() {
        return 'reset';
    }
    static get EVENT_TYPE_FIX() {
        return 'fix';
    }
    static get EVENT_TYPE_SWITCH() {
        return 'switch';
    }
    static get EVENT_TYPE_STOP() {
        return 'stop';
    }
    static get EVENT_TYPE_SAVE() {
        return 'save';
    }
    static get EVENT_TYPE_HELP() {
        return 'help';
    }
    static get EVENT_TYPE_SEARCH() {
        return 'search';
    }
    static get EVENT_TYPE_REPLACE() {
        return 'replace';
    }
    static get EVENT_TYPE_REMOVE() {
        return 'remove';
    }
    static get EVENT_TYPE_ADD() {
        return 'add';
    }
    static get EVENT_TYPE_ISSUE() {
        return 'issue';
    }
    static get EVENT_TYPE_RETURN() {
        return 'return';
    }
    static get EVENT_TYPE_RECONNECT() {
        return 'reconnect';
    }
    static get EVENT_TYPE_DISCONNECT() {
        return 'disconnect';
    }
    static get EVENT_TYPE_AUTO_RESIZE() {
        return 'autoResize';
    }
    static get EVENT_TYPE_INSTALL() {
        return 'install';
    }
    static get EVENT_TYPE_DISMANTLE() {
        return 'dismantle';
    }

    /**
     * System Types
     */
    static get SYSTEM_TYPE_ASSIGN_TYPE() {
        return 'assignType';
    }
    static get SYSTEM_TYPE_FAIL() {
        return 'fail';
    }

    static get SYSTEM_TYPE_PREF_HOMELAYOUT() {
        return  'pref.homeLayout';
    }

    /**
     * Page Types
     */
    static get PAGE_TYPE_OVERVIEW() {
        return 'overview';
    }
    static get PAGE_TYPE_LIST() {
        return 'listPage';
    }
    static get PAGE_TYPE_DETAIL() {
        return 'detlPage';
    }
    static get PAGE_TYPE_HIERARCHY() {
        return 'hierarchy';
    }
    static get PAGE_TYPE_ITEM_LIST() {
        return 'itemList';
    }
    static get PAGE_TYPE_ITEM_DETAIL() {
        return 'itemDetl';
    }
    static get PAGE_TYPE_SUB_LIST() {
        return 'subList';
    }
    static get PAGE_TYPE_SUB_DETAIL() {
        return 'subDetl';
    }
    static get PAGE_TYPE_EQUIP_LIST() {
        return 'equipList';
    }
    static get PAGE_TYPE_EQUIP_DETAIL() {
        return 'equipDetl';
    }
    static get PAGE_TYPE_FLOC_LIST() {
        return 'flocList';
    }
    static get PAGE_TYPE_FLOC_DETAIL() {
        return 'flocDetl';
    }

    /**
     * Initialize the Telemetry library
     * @param {context} context - MDK context
     * @returns {Promise} Promise that resolves when the library is initialized
     * @async
     */
    static async init(context) {
        return TelemetryEventLogger.getInstance().init(context);
    }

    /**
     * Log telemetry events
     * @param {context} context - MDK context
     * @param {string} eventKey - event key
     * @param {string} subEvent - sub event
     * @param {string} metadataInfo - metadata information
     */
    static logEvent(context, eventKey, subEvent, metadataInfo) {
        TelemetryEventLogger.getInstance().logEvent({
            eK: eventKey,
            sE: subEvent,
            mI: metadataInfo,
        }, !context.isDemoMode());
    }

    /**
     * Log telemetry events start
     * @param {context} context - MDK context
     * @param {string} logKey - log key
    */
    static logEventStart(context, logKey) {
        try {
            TelemetryEventLogger.getInstance().logEventStart(logKey, !context.isDemoMode());
        } catch (error) {
            Logger.error('TelemetryLibrary', 'logEventStart', error);
        }
    }

    /**
     * Log telemetry events end
     * @param {context} context - MDK context
     * @param {string} logKey - log key
     * @param {string} eventKey - event key
     * @param {string} subEvent - sub event
     * @param {string} metadataInfo - metadata information
     */
    static logEventEnd(context, logKey, eventKey, subEvent, metadataInfo) {
        try {
            TelemetryEventLogger.getInstance().logEventEnd(logKey, {
                eK: eventKey,
                sE: subEvent,
                mI: metadataInfo,
            }, !context.isDemoMode());
        } catch (error) {
            Logger.error('TelemetryLibrary', 'logEventEnd', error);
        }
    }

    /**
     * Log event for enabled features
     * @param {context} context - MDK context
     * @param {Array} featuresArr - array of enabled features
     */
    static async logFeatureEvents(context, featuresArr) {
        try {
            const personasArr = await context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '');
            const personasMap = new Map();
            const featuresMap = new Map();

            personasArr.forEach((persona) => {
                personasMap.set(persona.UserPersona, persona.PersonaCode);
            });

            featuresArr.forEach((feature) => {
                const personas = featuresMap.get(feature.UserFeature) || [];
                personas.push(personasMap.get(feature.UserPersona));
                featuresMap.set(feature.UserFeature, personas);
            });

            featuresMap.forEach((personas, feature) => {
                this.logEvent(context, feature, 'cf.enable', 'p=' + personas.join(','));
            });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Log event for delta sync start
     * @param {context} context - MDK context
     */
    static logSystemEventWithDeltaSyncStart(context) {
        this.logEventStart(context, 'DeltaSync');
    }

    /**
     * Log event for delta sync end
     * @param {context} context - MDK context
     * @param {string} result - success or failure
     */
    static logSystemEventWithDeltaSyncEnd(context, result) {
        this.logEventEnd(context, 'DeltaSync',
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Sync.global').getValue(),
            'sy.' + result, 't=Delta');
    }

    /**
     * Log event for initial sync start
     * @param {context} context - MDK context
     */
    static logSystemEventWithInitialSyncStart(context) {
        this.logEventStart(context, 'InitialSync');
    }

    /**
     * Log event for initial sync end
     * @param {context} context - MDK context
     * @param {string} result - success or failure
     */
    static logSystemEventWithInitialSyncEnd(context, result) {
        this.logEventEnd(context, 'InitialSync',
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Sync.global').getValue(),
            'sy.' + result, 't=Initial');
    }

    /**
     * Log event for client mode
     * @param {context} context - MDK context
     */
    static logUserEventWithLaunchMode(context) {
        TelemetryEventLogger.getInstance().logEvent({
            eK: context.getGlobalDefinition('/SAPAssetManager/Globals/Features/User.global').getValue(),
            sE: 'ev.launch',
            mI: 'o=' + (context.isDemoMode() ? 'demo' : 'live'),
        }, true);
    }

    /**
     * Execute an action and log telemetry user event
     * @param {context} context - MDK context
     * @param {action} action - action to execute
     * @param {string} eventKey - event key
     * @param {string} subEvent - sub event
     * @param {string} metadataInfo - metadata information
     */
    static executeActionWithLogUserEvent(context, action, eventKey, subEvent, metadataInfo) {
        // Telemetry event
        this.logUserEvent(context, eventKey, subEvent, metadataInfo);
        // Execute the action
        return action ? context?.executeAction(action) : Promise.resolve();
    }

    /**
     * Log system event
     * @param {context} context - MDK context
     * @param {string} eventKey - event key
     * @param {string} subEvent - sub event
     * @param {string} metadataInfo - metadata information
     */
    static logSystemEvent(context, eventKey, subEvent, metadataInfo) {
        this.logEvent(context, eventKey, 'sy.' + subEvent,
            metadataInfo ? 't=' + metadataInfo : undefined);
    }

    /**
     * Log user event
     * @param {context} context - MDK context
     * @param {string} eventKey - event key
     * @param {string} subEvent - sub event
     * @param {string} metadataInfo - metadata information
     */
    static logUserEvent(context, eventKey, subEvent, metadataInfo) {
        this.logEvent(context, eventKey, 'ev.' + subEvent,
            metadataInfo ? 'o=' + metadataInfo : undefined);
    }

    /**
     * Log page event
     * @param {context} context - MDK context
     * @param {string} eventKey - event key
     * @param {string} subEvent - sub event
     * @param {string} metadataInfo - metadata information
     */
    static logPageEvent(context, eventKey, subEvent, metadataInfo) {
        this.logEvent(context, eventKey, 'pg.view.' + subEvent,
            metadataInfo ? 'o=' + metadataInfo : undefined);
    }

    /**
     * Execute an action and log telemetry user event
     * @param {context} context - MDK context
     * @param {action} action - navigation action to execute
     * @param {string} eventKey - event key
     * @param {string} subEvent - sub event
     * @param {string} metadataInfo - metadata information
     */
    static executeActionWithLogPageEvent(context, action, eventKey, subEvent, metadataInfo) {
        // Telemetry event
        this.logPageEvent(context, eventKey, subEvent, metadataInfo);
        // Execute the action
        return action ? context?.executeAction(action) : Promise.resolve();
    }

    /**
     * Log user event with mobile status
     * @param {context} context - MDK context
     * @param {string} oDataType - OData type
     * @param {string} mobileStatus - mobile status
     */
    static logUserEventWithMobileStatus(context, oDataType,  mobileStatus) {
        const mobileStatusMap = new Map([
            ['STARTED', 'start'],
            ['COMPLETED', 'complete'],
        ]);
        const validStatus = mobileStatusMap.get(mobileStatus);
        if (validStatus) {
            const oDataTypeMap = new Map([
                [libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrder.global'), ['PMWorkOrder.global']],
                [libCom.getGlobalDefinition(context, 'ODataTypes/Notification.global'), ['PMNotifications.global']],
                [libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderOperation.global'), ['PMWorkOrder.global','op']],
            ]);
            const validType = oDataTypeMap.get(oDataType);
            if (validType) {
                this.logUserEvent(context,
                    context.getGlobalDefinition(`/SAPAssetManager/Globals/Features/${validType[0]}`).getValue(),
                    validStatus + (validType[1] ? '.' + validType[1] : ''));
            }
        }
    }
}
