import { processSetTaggedUntaggedNav } from '../SetTagged/SetTaggedNav';
import { TagStates } from '../libWCMDocumentItem';

export default function SetUntaggedNav(context) {
    return processSetTaggedUntaggedNav(context, TagStates.SetUntagged);
}
