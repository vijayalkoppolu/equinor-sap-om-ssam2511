import { ValueIfExists } from '../Common/Library/Formatter';

export default function PartReservation(context) {
    return ValueIfExists(context.binding.RequirementNumber);
}
