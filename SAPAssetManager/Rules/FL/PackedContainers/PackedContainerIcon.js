import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PackedContainerIcon(context) {
    const icons = [];
    const binding = context.binding;
    // Check for local changes or pending batch
    const hasPendingChanges = binding['@sap.hasPendingChanges'] === true;
    const isLocal = binding['@sap.isLocal'] === true;
    const isUpdated = binding.ActionType === 'SEAL' || binding.ActionType === 'UNSEAL' || binding.ActionType === 'GOODSISSUE' || binding.ActionType === 'DISPATCH';
    const isEditAction = binding.ActionType === 'EDITALL';

    if (isEditAction) {
        return icons;
    }

    if (hasPendingChanges || isLocal || isUpdated) {
        icons.push(CommonLibrary.GetSyncIcon(context));
    }
    
    return icons;
}
