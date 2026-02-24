import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function TimeEntryViewWBSElement(context) {
    return ValueIfExists(context.binding.WBSElement);
}
