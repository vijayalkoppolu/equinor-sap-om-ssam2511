
import autoSyncOnResume from './AutoSync/AutoSyncOnResume';
import libConfirm from '../ConfirmationScenarios/ConfirmationScenariosLibrary';

export default function ResumeEventHandler(context) {
    libConfirm.checkAppResumedDuringCountDown(context);
    return autoSyncOnResume(context);
}
