
export default function OnlineMeasuringPointHistoryListViewNav(clientAPI) {
    clientAPI.binding.IsOnline = true;
    return clientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointHistoryListViewNav.action');
}
