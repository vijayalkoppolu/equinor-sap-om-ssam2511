import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function DeleteEntityOnSuccess(context) {
    const fromPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    const fromClientData = fromPage?.getClientData();
    const fromPageId = fromPage?._page?.id;
    const isFromErrorArchiveOrMap = fromClientData?.FromErrorArchive ||
                                    fromPageId?.includes('MapExtension') ||
                                    fromPageId?.includes('MapDetails');

    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action').then(() => {
        return isFromErrorArchiveOrMap ? Promise.resolve(true) : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    });
}
