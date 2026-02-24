import libCom from '../../Common/Library/CommonLibrary';
export default function FLPackedPackageAssignCntPageNav(clientAPI) {
  const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
  const selectedItems =
    section.getSelectedItems().map((item) => item.binding) || [];
  libCom.setStateVariable(clientAPI, 'SelectedPackedPackages', selectedItems);
  libCom.setStateVariable(clientAPI, 'PackedPackages', false);

  return clientAPI.executeAction(
    '/SAPAssetManager/Actions/FL/PackedPackages/FLPackedPackageAssignCntPageNav.action',
  );
}
