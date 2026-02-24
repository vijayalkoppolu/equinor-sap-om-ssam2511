import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import ODataLibrary from '../../OData/ODataLibrary';

export default function WorkOrderListViewIconImages(context) {
    let binding = context.getBindingObject();
    let iconImage = [];

    // check if this WO has any docs
    const docsIcon = AttachedDocumentIcon(context, binding.WODocuments);
    if (docsIcon) {
        iconImage.push(docsIcon);
    }

    // check if this is a Marked Job
    if (binding.MarkedJob && binding.MarkedJob.PreferenceValue && binding.MarkedJob.PreferenceValue === 'true') {
        iconImage.push('sap-icon://favorite');
    }

    let hasLocalOperation = binding.Operations ? binding.Operations.find(operation => ODataLibrary.hasAnyPendingChanges(operation)) : false;
    let hasLocalNote = binding?.HeaderLongText ? binding.HeaderLongText.find(note => ODataLibrary.hasAnyPendingChanges(note)) : false;
    // check if this order requires sync

    if (ODataLibrary.hasAnyPendingChanges(binding) || hasLocalOperation || ODataLibrary.hasAnyPendingChanges(binding.OrderMobileStatus_Nav) || hasLocalNote) {
        iconImage.push('sap-icon://synchronize');
    }

    return iconImage;
}
