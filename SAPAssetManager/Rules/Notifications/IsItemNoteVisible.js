import GetNotificationItemStepData from './CreateUpdate/GetNotificationItemStepData';

/**
* Disable the note if item exists as we dont support editing long text in chain set.
* @param {IClientAPI} clientAPI
*/
export default async function IsItemNoteVisible(clientAPI) {
    const itemData = await GetNotificationItemStepData(clientAPI);
    return !(itemData?.Item);
}
