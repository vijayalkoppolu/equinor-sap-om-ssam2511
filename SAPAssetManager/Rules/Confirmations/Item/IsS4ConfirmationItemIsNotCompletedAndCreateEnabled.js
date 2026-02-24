
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';

export default async function IsS4ConfirmationItemIsNotCompletedAndCreateEnabled(context) {
    if (!S4ServiceAuthorizationLibrary.isServiceConfirmationCreateEnabled(context)) return false;

    let entity = context.binding['@odata.readLink'] + '/S4ServiceConfirmation_Nav';
    let query = '$expand=MobileStatus_Nav';
          
    return S4ServiceLibrary.isServiceObjectCompleted(context, context.binding, context.binding.MobileStatus_Nav).then(async isItemCompleted => {
        if (isItemCompleted) return false;
        
        const confirmation = await context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], query).then(result => result.length ? result.getItem(0) : null);
        if (confirmation) {
            return S4ServiceLibrary.isServiceObjectCompleted(context, confirmation, confirmation.MobileStatus_Nav).then(isCompleted => {
                return !isCompleted;
            });
        }
        return true;
    });
}
