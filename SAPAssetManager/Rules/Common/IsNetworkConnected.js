import NetworkLib from '../Common/Library/NetworkMonitoringLibrary';
export default function isNetworkConnected(clientAPI) {
    return NetworkLib.isNetworkConnected(clientAPI);
}
