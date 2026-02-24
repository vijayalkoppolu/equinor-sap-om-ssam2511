import allSyncronizationGroups from '../DefiningRequests/AllSyncronizationGroups';
import libCom from '../../Common/Library/CommonLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import ApplicationOnUserSwitch from '../../ApplicationEvents/ApplicationOnUserSwitch';

export default function DownloadActionsOrRulesSequence(context) {
    let initialSync = libCom.isInitialSync(context);
    libCom.setApplicationLaunch(context, false);
    let userSwitchDeltaCompleted = ApplicationSettings.getBoolean(context, 'didUserSwitchDeltaCompleted', true);
    if (userSwitchDeltaCompleted === false) { // dont do any download if user switch delta is in progress
        return ApplicationOnUserSwitch(context);
    }

    if (!initialSync) {
        return [
            InitializeOfflineOData(context),
            InitializeCachedStaticVariables(context),
            InitializeGlobalStates(context),
            ReloadUserFeatures,
            {
                'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Persona/LoadPersonaOverviewAllowSkip.js'),
                'Caption': '',
            },
            FetchEPDVisualizations,
            OverviewOnPageReload,
            ApplicationStartupMessage,
            ScannerInit,
            SDFCleanAttachmentCache,
            SetAppLaunchFinished,
        ];
    }

    return getInitialSyncRules(context);
}

function getInitialSyncRules(context) {
    return [
        GetIMPersonaEntityLinks,
        {
            'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Forms/SDF/InitialTransmit.js'),
            'Caption': '',
        },
        InitializeOfflineOData(context),
        InitializeCachedStaticVariables(context),
        InitializeGlobalStates(context),
        {
            'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/UserPreferences/SetUpDefaultHomeScreen.js'),
            'Caption': context.localizeText('set_default_home_screen_preference'),
        },
        {
            'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Persona/ReloadPersonaOverview.js'),
            'Caption': context.localizeText('loading_persona'),
        },
        {
            'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Documents/DownloadHTMLTemplate.js'),
            'Caption': context.localizeText('downloading_html_template'),
        },
        ReloadUserFeatures,
        OverviewOnPageReload,
        FetchEPDVisualizations,
        {
            'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Persona/UpdatePersonaOverview.js'),
            'Caption': context.localizeText('update_persona_overview_page'),
        },
        ScannerInit,
        {
            'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Common/SaveMetadataAfterInitialSync.js'),
            'Caption': '',
        },
        SetAppLaunchFinished,
        {
            'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/UserPreferences/ShowHomeScreenInfoMessage.js'),
            'Caption': '',
        },
        ApplicationStartupMessage,
    ];
}

const SetAppLaunchFinished = Object.freeze({
    'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Common/SetAppLaunchFinished.js'),
    'Caption': '',
});

const GetIMPersonaEntityLinks = Object.freeze({
    'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Inventory/Common/GetIMPersonaEntityLinks.js'),
    'Caption': '',
});

const ReloadUserFeatures = Object.freeze({
    'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/UserFeatures/ReloadUserFeatures.js'),
    'Caption': '',
});

function InitializeOfflineOData(context) {
    return {
        'Callable': (clientAPI) => clientAPI.executeAction({
            'Name': '/SAPAssetManager/Actions/OData/InitializeOfflineOData.action',
            'Properties': {
                'DefiningRequests': allSyncronizationGroups(context),
                'OnFailure': '/SAPAssetManager/Actions/OData/InitializeOfflineODataFailureMessage.action',
            },
        }),
        'Caption': context.localizeText('application_initialization'),
    };
}

function InitializeCachedStaticVariables(context) {
    return {
        'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Common/InitializeCachedStaticVariables.js'),
        'Caption': context.localizeText('Initializing_globals'),
    };
}

function InitializeGlobalStates(context) {
    return {
        'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Common/InitializeGlobalStates.js'),
        'Caption': context.localizeText('Initializing_globals'),
    };
}

const FetchEPDVisualizations = Object.freeze({
    'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/EPD/FetchEPDVisualizations.js'),
    'Caption': '',
});

const OverviewOnPageReload = Object.freeze({
    'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/OverviewPage/OverviewOnPageReload.js'),
    'Caption': '',
});

const ApplicationStartupMessage = Object.freeze({
    'Callable': (clientAPI) => clientAPI.executeAction('/SAPAssetManager/Actions/ApplicationStartupMessage.action'),
    'Caption': '',
});

const ScannerInit = Object.freeze({
    'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Extensions/Scanner/ScannerInit.js'),
    'Caption': '',
});

const SDFCleanAttachmentCache = Object.freeze({
    'Callable': (clientAPI) => clientAPI.getDefinitionValue('/SAPAssetManager/Rules/Forms/SDF/CleanAttachmentCache.js'),
    'Caption': '',
});
