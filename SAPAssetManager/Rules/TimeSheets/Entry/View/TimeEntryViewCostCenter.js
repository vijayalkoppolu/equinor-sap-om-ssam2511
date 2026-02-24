import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function TimeEntryViewCostCenter(context) {
    return ValueIfExists(context.binding.CostCenter);
}
