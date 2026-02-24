import { ContainerItemStatus } from '../Common/FLLibrary';
export default function IsEditAllowed(clientAPI) {
    const icon = 'sap-icon://write-new';
    return (clientAPI.binding.VoyageUUID && clientAPI.binding.ContainerItemStatus === ContainerItemStatus.Dispatched || clientAPI.binding.ContainerItemStatus === ContainerItemStatus.Received || clientAPI.binding.ContainerItemStatus === ContainerItemStatus.NotFound)? '' : icon;
}
