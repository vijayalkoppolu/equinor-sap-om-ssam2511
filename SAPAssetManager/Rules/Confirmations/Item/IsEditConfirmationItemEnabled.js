import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';

export default function IsEditConfirmationItemEnabled(context, binding = context.binding) {
    const isNotCompeted = S4ServiceLibrary.isServiceObjectCompleted(context, binding, binding?.MobileStatus_Nav).then(isCompleted => {
        return !isCompleted;
    });

    return (S4ServiceAuthorizationLibrary.isServiceConfirmationEditEnabled(context) || CommonLibrary.isEntityLocal(binding)) && isNotCompeted;
}
