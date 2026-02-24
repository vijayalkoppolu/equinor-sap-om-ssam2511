import { ValueIfExists } from '../../../Common/Library/Formatter';
import { GetFSMCrewMemberWrapper } from './FSMS4CrewMemberAddress';

export default function FSMS4CrewMemberPhone(context) {
    const wrapper = GetFSMCrewMemberWrapper(context);
    const phone = wrapper.communicationProperty('Telephone');

    return ValueIfExists(phone);
}
