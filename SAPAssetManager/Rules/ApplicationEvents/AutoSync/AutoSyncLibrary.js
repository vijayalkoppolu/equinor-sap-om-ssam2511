import NetworkLib from '../../Common/Library/NetworkMonitoringLibrary';
import FeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import CommonLib from '../../Common/Library/CommonLibrary';
import PersonaLib from '../../Persona/PersonaLibrary';
import Logger from '../../Log/Logger';
import IsSyncInProgress from '../../Sync/IsSyncInProgress';
import SyncDataInBackground from '../SyncData';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import self from './AutoSyncLibrary';
import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';

export default class AutoSyncLibrary {

    static autoSync(context, autoSyncProfile) {
        const autoSyncConst = context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSync.global').getValue();
        if (self.didThresholdPeriodPass(context)) {
            if (!NetworkLib.isNetworkConnected(context)) {
                Logger.error(autoSyncConst, 'no network connection');
                // setTimeout is required to display an error message after all other actions (navigation, success message) have completed.
                setTimeout(() => {
                    context.executeAction('/SAPAssetManager/Actions/OData/InitializeOfflineODataCreateFailureMessage.action');
                }, 5000);
                return false;
            }

            if (!IsSyncInProgress(context) && !ApplicationSettings.getBoolean(context, 'onAppLaunch')) {
                // Put the auto sync profile in the client data so that it can be used in the SyncData action
                context.getPageProxy().getClientData().autoSyncProfile = autoSyncProfile;
                
                self.setAutoSyncInProgress(context, true);
                libTelemetry.logSystemEvent(context,
                    context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Sync.global').getValue(),
                    libTelemetry.EVENT_TYPE_START, 'Auto'); // custom sub-type for auto sync
                let syncAction = self.showSyncBanner(context) ? 
                    context.executeAction('/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action') :
                    SyncDataInBackground(context);

                context.dismissActivityIndicator(); // RunMobileStatusUpdateSequence triggers showActivityIndicator which blocks main screen

                return syncAction
                    .then(() => {
                        Logger.info(autoSyncConst, 'auto sync succeeded');
                        return true;
                    }).catch(() => {
                        Logger.error(autoSyncConst, 'failed to auto sync');
                        return false;
                    }).finally(() => {
                        CommonLib.setStateVariable(context, 'lastAutoSyncDateTime', (new Date()).toISOString());
                        self.setAutoSyncInProgress(context, false);
                    });
            }
        }

        return true;
    }

    static showSyncBanner(context) {
        const isBannerVisible = self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncBannerConfig.global');
        return isBannerVisible === 'Y';
    }

    static isAutoSyncEnabledOnResume(context) {
        return (self.isAutoSyncFeatureEnabled(context) && 
            (self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncResume.global') ||
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncResume.global').getValue())));
    }

    static isAutoSyncEnabledOnSave(context) {
        const thresholdPeriod = self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncThresholdPeriod.global');
        if (!thresholdPeriod || thresholdPeriod <= 0) {
            return false;
        }

        return (self.isAutoSyncFeatureEnabled(context) && 
            (self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncOnSave.global')) || 
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnSave.global').getValue()));
    }
    
    static isAutoSyncEnabledOnConnectionChange(context) {
        return (self.isAutoSyncFeatureEnabled(context) && 
            (self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncOnConnectionChange.global') ||
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnConnectionChange.global').getValue())));
    }

    static isPeriodicAutoSyncEnabled(context) {
        if (self.isAutoSyncFeatureEnabled(context) && PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue(), 'not_defined') !== 'not_defined') {
            const value = PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue());
            return Number(value) > 0;
        }
        return self.isAutoSyncFeatureEnabled(context) && 
            self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global');
    }
    
    static isAutoSyncEnabledOnStatusChange(context) {
        return (self.isAutoSyncFeatureEnabled(context) && 
            (self.isAutoSyncParamEnabled(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncOnStatusChange.global')) ||
            PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncOnStatusChange.global').getValue()));
    }

    static getAutoSyncPeriodValue(context) {
        if (PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue(), 'not_defined') !== 'not_defined') {
            const value = PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue());
            return Number(value) * 60; // value comes in hrs, so convert to minutes
        }
        return self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global');
    }

    static getAutoSyncParamValue(context, paramNameFilePath) {
        return CommonLib.getAppParam(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSync.global').getValue(),
            context.getGlobalDefinition(paramNameFilePath).getValue());
    }
    
    static isAutoSyncParamEnabled(context, paramNameFilePath) {
        const paramValue = self.getAutoSyncParamValue(context, paramNameFilePath);
        return paramValue === 'Y' || paramValue > 0;
    }

    static isAutoSyncFeatureEnabled(context) {
        const feature = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AutoSync.global');
        return FeaturesLib.isFeatureEnabled(context, feature.getValue());
    }

    static autoSyncOnAppResume(context) {
        if (self.isAutoSyncEnabledOnResume(context)) {
            return self.autoSync(context);
        }

        return true;
    }

    static autoSyncOnSave(context, autoSyncProfile) {
        if (self.isAutoSyncEnabledOnSave(context)) {
            return self.autoSync(context, autoSyncProfile);
        }

        return true;
    }

    static autoSyncPeriodically(context) {
        // clear previous interval if exists
        const existingInterval = CommonLib.getStateVariable(context, 'autoSyncIntervalID');
        if (CommonLib.isDefined(existingInterval)) {
            clearInterval(existingInterval);
            CommonLib.removeStateVariable(context, 'autoSyncIntervalID');
        }
        if (self.isPeriodicAutoSyncEnabled(context)) {
            const interval = self.getAutoSyncPeriodValue(context) * 60 * 1000; // value comes in minutes, so convert to ms
            const intervalID = setInterval(self.autoSync, interval, context);
            CommonLib.setStateVariable(context, 'autoSyncIntervalID', intervalID);
        }

        return true;
    }

    static clearPeriodicInterval(context) {
        if (self.isAutoSyncFeatureEnabled(context)) {
            const periodicValue = PersonalizationPreferences.getDeltaSyncPreference(context, context.getGlobalDefinition('/SAPAssetManager/Globals/AutoSync/AutoSyncPeriodic.global').getValue(), 0);
            const interval = Number(periodicValue) * 60 * 60 * 1000; // values comes in hrs, so convert to ms
            if (interval > 0) {
                clearInterval(interval);
            }
        }
    }

    static autoSyncOnConnectionChange(context) {
        NetworkLib.getInstance().removeCallbackAction('initializeSync');
        if (self.isAutoSyncEnabledOnConnectionChange(context)) {
            NetworkLib.getInstance().addCallbackAction('initializeSync', function() {
                if (!CommonLib.isInitialSync(context)) {
                    return self.autoSync(context);
                }
                
                return true;
            });
        }

        return true;
    }

    static autoSyncOnStatusChange(context) {
        if (self.isAutoSyncEnabledOnStatusChange(context)) {
            return self.autoSync(context);
        }

        return true;
    }
    
    static didThresholdPeriodPass(context) {
        const thresholdPeriod = self.getAutoSyncParamValue(context, '/SAPAssetManager/Globals/AutoSync/AutoSyncThresholdPeriod.global');
        const lastAutoSync = CommonLib.getStateVariable(context, 'lastAutoSyncDateTime');
        if (!CommonLib.isDefined(lastAutoSync)) {
            return true;
        }

        const currentDateTime = new Date();
        const lastAutoSyncDateTime = new Date(lastAutoSync);
        return Math.ceil((currentDateTime - lastAutoSyncDateTime) / 60000) > thresholdPeriod;
    }
    
    static setAutoSyncInProgress(context, flag) {
        CommonLib.setStateVariable(context, 'IsAutoSync', flag);
        const currentPageName = CommonLib.getPageName(context);
        const overviewPageName = PersonaLib.getPersonaOverviewStateVariablePage(context);

        try {
            // change action bar item manually as we don't want to redraw overview page
            let overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
            overviewPage.setActionBarItemVisible('AutoSync', flag);
            overviewPage.setActionBarItemVisible('Sync', !flag);
        } catch (error) {
            Logger.error('setAutoSyncInProgress', error);
        }

        if (currentPageName !== overviewPageName) {
            context.redraw();
        }
    }
}
