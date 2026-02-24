import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default async function IsEditServiceConfirmationEnabled(context, binding = context.binding) {
    const isNotCompleted = await S4ServiceLibrary.isServiceObjectCompleted(context, binding, binding?.MobileStatus_Nav).then(isCompleted => {
        return context.binding.CreatedBy === CommonLibrary.getSapUserName(context) && !isCompleted;
    });

    return (S4ServiceAuthorizationLibrary.isServiceConfirmationEditEnabled(context) || CommonLibrary.isEntityLocal(binding)) && isNotCompleted;
}
