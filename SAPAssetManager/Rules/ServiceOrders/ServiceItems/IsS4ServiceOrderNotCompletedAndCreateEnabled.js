import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import IsServiceItemOrderNotCompleted from './IsServiceItemOrderNotCompleted';

export default async function IsS4ServiceOrderNotCompletedAndCreateEnabled(context) {
    return await IsServiceItemOrderNotCompleted(context) && S4ServiceAuthorizationLibrary.isServiceOrderCreateEnabled(context);
}
