import Logger from '../Log/Logger';
import ApplicationSettings from './Library/ApplicationSettings';
import libCommon from './Library/CommonLibrary';
import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';
import ODataLibrary from '../OData/ODataLibrary';

const MOBILE_STATUS_SEQS_SETTING_NAME = 'MobileStatusSeqs';
const EAM_OVER_ALL_STATUS = 'EAMOverallStatus';
const NOTIFICATION_TYPES = 'NotificationTypes';
const ORDER_TYPES = 'OrderTypes';

export default async function CacheMobileStatusSequences(context, statusSeqs) {
    const result = statusSeqs || await ReadMobileStatusSequencesFromOfflineProvider(context);

    if (result) {
        const isGuidedFlowEnabled = UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GuidedFlow.global').getValue());
        if (isGuidedFlowEnabled) {
            const eamStatusResult = await ODataLibrary.readFromOfflineService(context, 'EAMOverallStatusConfigs', '');
            saveToAppSettings(context, EAM_OVER_ALL_STATUS, eamStatusResult);

            const notificationTypesResult = await ODataLibrary.readFromOfflineService(context, 'NotificationTypes', '');
            saveToAppSettings(context, NOTIFICATION_TYPES, notificationTypesResult);
            
            const orderTypesResult = await ODataLibrary.readFromOfflineService(context, 'OrderTypes', '');
            saveToAppSettings(context, ORDER_TYPES, orderTypesResult);
        }
        const jsonString = convertSequencesArrayToJSONString(result);
        ApplicationSettings.setString(context, MOBILE_STATUS_SEQS_SETTING_NAME, jsonString);
        Logger.info('EAMOverallStatusSeqs saved to app settings');
    }
}

export function saveToAppSettings(context, key, data) {
    const jsonString = convertSequencesArrayToJSONString(data);
    ApplicationSettings.setString(context, key, jsonString);
}

export function GetNotificationTypes(context) {
    // Read from app settings first
    const cachedValue = ApplicationSettings.getString(context, NOTIFICATION_TYPES);

    return cachedValue ? convertJSONStringToSequencesArray(cachedValue) : null;
}

export function GetOrderTypes(context) {
    // Read from app settings first
    const cachedValue = ApplicationSettings.getString(context, ORDER_TYPES);

    return cachedValue ? convertJSONStringToSequencesArray(cachedValue) : null;
}

export function GetEAMOverallStatusConfigs(context) {
    // Read from app settings first
    const cachedValue = ApplicationSettings.getString(context, EAM_OVER_ALL_STATUS);

    return cachedValue ? convertJSONStringToSequencesArray(cachedValue) : null;
}

export function GetCachedMobileStatusSequences(context) {
    // Read from app settings first
    const cachedValue = ApplicationSettings.getString(context, MOBILE_STATUS_SEQS_SETTING_NAME);

    return cachedValue ? convertJSONStringToSequencesArray(cachedValue) : null;
}

export async function ReadMobileStatusSequencesFromOfflineProvider(context) {
    try {
        const isGuidedFlowEnabled = UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GuidedFlow.global').getValue());
        const result = isGuidedFlowEnabled ?
            await context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowStatusSeqs', [], '$expand=GuidedFlowToStatusConfig_Nav') :
            await context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusSeqs', [], '$expand=OverallStatusCfg_Nav,NextOverallStatusCfg_Nav');
        
        return libCommon.isDefined(result) ? Array.from(result) : [];
    } catch (error) {
        Logger.error('ReadMobileStatusSequencesFromOfflineProvider', error);
        return [];
    }
}

function convertSequencesArrayToJSONString(array) {
    try {
        return JSON.stringify(array);
    } catch (error) {
        Logger.error('convertSequencesArrayToJSONString', error);
        return '';
    }
}

function convertJSONStringToSequencesArray(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        Logger.error('convertJSONStringToSequencesArray', error);
        return null;
    }
}
