import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default async function IsS4ServiceRequestEditEnabled(context, binding = context.binding) {
    const isNotCompleted = S4ServiceLibrary.isServiceObjectCompleted(context, binding).then(isCompleted => {
        return !isCompleted;
    });

    return (S4ServiceAuthorizationLibrary.isServiceRequestEditEnabled(context) || CommonLibrary.isEntityLocal(binding)) && isNotCompleted;
}
