import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function TimeEntryViewActivity(context) {
    return ValueIfExists(context.binding.Activity);
}
