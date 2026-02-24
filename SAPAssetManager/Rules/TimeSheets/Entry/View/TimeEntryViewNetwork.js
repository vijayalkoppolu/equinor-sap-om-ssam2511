import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function TimeEntryViewNetwork(context) {
    return ValueIfExists(context.binding.Network);
}
