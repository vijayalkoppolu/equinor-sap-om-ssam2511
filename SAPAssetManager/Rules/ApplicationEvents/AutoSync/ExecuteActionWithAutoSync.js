import AutoSyncLib from './AutoSyncLibrary';

export default function ExecuteActionWithAutoSync(context, actionName, autoSyncProfile) {
    AutoSyncLib.autoSyncOnSave(context, autoSyncProfile);
    return actionName ? context.executeAction(actionName) : Promise.resolve();
}
