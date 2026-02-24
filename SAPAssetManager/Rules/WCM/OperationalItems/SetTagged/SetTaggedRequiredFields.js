import IsWCMSignatureEnabled from '../SignatureAttachment/IsWCMSignatureEnabled';
import IsLockNumberRequired from './IsLockNumberRequired';
import { TagStates } from '../libWCMDocumentItem';

export default function SetTaggedRequiredFields(context) {
    const fields = [];
    if (IsLockNumberRequired(context) && context.binding.taggingState === TagStates.SetTagged) {
        fields.push('LockNumber');
    }
    if (IsWCMSignatureEnabled(context)) {
        fields.push('SignatureCaptureFormCell');
    }
    return fields;
}
