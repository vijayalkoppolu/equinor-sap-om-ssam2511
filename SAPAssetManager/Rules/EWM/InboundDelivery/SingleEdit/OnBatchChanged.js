export default function OnBatchChanged(controlProxy, binding = controlProxy.binding || controlProxy.getPageProxy()?.binding) {
  controlProxy.clearValidationOnValueChange?.(false);
  if (binding) {
    binding.hasErrors = false;
    binding._ErrorReason = null;
    binding._ErrorMessage = null;
  }
}
