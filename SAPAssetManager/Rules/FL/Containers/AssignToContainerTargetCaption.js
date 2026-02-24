export default function AssignToContainerTargetCaption(clientAPI, binding = clientAPI.getPageProxy().binding) {
  const fromTab = binding?.tab;

  if (fromTab === 'ReadyToPack') {
    return clientAPI.localizeText('fld_assign_to_container_or_package');
  }

  return clientAPI.localizeText('fld_assign_to_container');
}
