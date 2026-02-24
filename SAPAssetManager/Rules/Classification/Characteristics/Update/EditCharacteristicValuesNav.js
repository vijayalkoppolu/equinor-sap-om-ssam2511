import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function EditCharacteristicValuesNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicValueUpdateNav.action');
}
