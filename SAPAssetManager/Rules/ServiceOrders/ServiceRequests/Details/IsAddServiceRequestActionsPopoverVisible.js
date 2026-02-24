import Logger from '../../../Log/Logger';
import IsS4ServiceOrderCreateEnabled from '../../CreateUpdate/IsS4ServiceOrderCreateEnabled';
import IsServiceRequestIsNotCompleted from './IsServiceRequestIsNotCompleted';
import IsServiceRequestIsNotCompletedAndCreateEnabled from './IsServiceRequestIsNotCompletedAndCreateEnabled';

export default function IsAddServiceRequestActionsPopoverVisible(context) {
    return Promise.all([
        IsS4ServiceOrderCreateEnabled(context),
        IsServiceRequestIsNotCompletedAndCreateEnabled(context),
        IsServiceRequestIsNotCompleted(context),
    ]).then(result => {
        return result.some(visibility => visibility);
    })
    .catch(error => {
        Logger.error('IsAddServiceRequestActionsPopoverVisible', error);
        return false;
    });
}
