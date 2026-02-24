import SetIcons from './SetIcons';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
export default function ContainerIcons(clientAPI) {
    const failedItems = CommonLibrary.getStateVariable(clientAPI, 'FailedItems');
    if (failedItems?.length > 0) {
        const matchedItem = failedItems.find(item => clientAPI.binding.ContainerID === item.ContainerID);
        if (matchedItem) {
            return SetIcons(clientAPI);
        }
    }
    return [];
}
