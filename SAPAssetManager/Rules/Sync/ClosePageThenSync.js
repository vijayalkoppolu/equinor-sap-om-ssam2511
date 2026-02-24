import applicationOnSync from '../ApplicationEvents/ApplicationOnSync';

export default function ClosePageThenSync(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        return applicationOnSync(context);
    });
}
