import AutoSyncLib from './AutoSyncLibrary';

export default function AutoSyncOnSave(context, autoSyncProfile) {
    AutoSyncLib.autoSyncOnSave(context, autoSyncProfile);
    return Promise.resolve(true);
}
