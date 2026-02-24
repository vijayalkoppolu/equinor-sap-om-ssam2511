import S4ServiceAuthorizationLibrary from '../../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import IsServiceRequestIsNotCompleted from './IsServiceRequestIsNotCompleted';

export default async function IsServiceRequestIsNotCompletedAndCreateEnabled(context) {
    const isNotCompleted = await IsServiceRequestIsNotCompleted(context);
    return S4ServiceAuthorizationLibrary.isServiceRequestCreateEnabled(context) && isNotCompleted;
}
