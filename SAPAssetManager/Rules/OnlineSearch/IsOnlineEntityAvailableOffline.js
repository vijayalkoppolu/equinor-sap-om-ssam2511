export function IsOnlineEntityAvailableOffline(context, entity, filterField) {
    const binding = Object.hasOwn(context.binding || {}, '@odata.readLink') ? context.binding : context.getActionBinding();
    return context.count('/SAPAssetManager/Services/AssetManager.service', entity, `$filter=${filterField} eq '${binding[filterField]}'`).then((count) => {
        return count > 0;
    })
    .catch(() => {
        return false;
    });
}
