import IsNotCompleteAction from '../../WorkOrders/Complete/IsNotCompleteAction';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function IsCancelSelectConfirmationButtonVisible(context) {
    const isStartPageItemsFlag = ServiceConfirmationLibrary.getInstance().getStartPage() === ServiceConfirmationLibrary.itemsFlag;
    const isNotComplete = IsNotCompleteAction(context);
    const isAutoConfirmationCreate = ServiceConfirmationLibrary.getInstance().isAutoConfirmationCreate();
    
    return (isStartPageItemsFlag && isNotComplete) || isAutoConfirmationCreate;
}
