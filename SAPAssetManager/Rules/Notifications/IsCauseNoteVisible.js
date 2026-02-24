import GetNotificationItemStepData from './CreateUpdate/GetNotificationItemStepData';

/**
* Disable the update if cause exists as we dont support editing long text in chain set.
* @param {IClientAPI} clientAPI
*/
export default async function IsCauseNoteVisible(clientAPI) {
    const itemData = await GetNotificationItemStepData (clientAPI);
    return !(itemData?.Cause);
}
