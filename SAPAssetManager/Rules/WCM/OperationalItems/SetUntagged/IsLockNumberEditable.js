import { TagStates } from '../libWCMDocumentItem';

export default function IsLockNumberEditable(context) {
    return context.binding.taggingState === TagStates.SetTagged;
}
