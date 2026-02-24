import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default async function IsS4ServiceItemEditEnabled(context, binding = context.binding) {
    const isNotCompleted = await S4ServiceLibrary.isServiceObjectCompleted(context, binding, binding?.MobileStatus_Nav).then(isCompleted => {
        return !isCompleted;
    });

    return (S4ServiceAuthorizationLibrary.isServiceOrderEditEnabled(context) || CommonLibrary.isEntityLocal(binding)) && isNotCompleted;
}
