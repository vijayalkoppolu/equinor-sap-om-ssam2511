import libCommon from '../../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default async function CharacteristicLamValuesUpdateNav(clientAPI) {
    libCommon.setOnCreateUpdateFlag(clientAPI, 'UPDATE');

    let modifiedBinding = Object.assign({}, clientAPI.binding);
    modifiedBinding.StartPoint = await LocalizationLibrary.formatBackendValueToNumber(clientAPI, modifiedBinding.StartPoint);
    modifiedBinding.EndPoint = await LocalizationLibrary.formatBackendValueToNumber(clientAPI, modifiedBinding.EndPoint);
    modifiedBinding.Length = await LocalizationLibrary.formatBackendValueToNumber(clientAPI, modifiedBinding.Length);
    clientAPI.getPageProxy().setActionBinding(modifiedBinding);

    return clientAPI.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicLAMValuesCreateUpdateNav.action');
}
