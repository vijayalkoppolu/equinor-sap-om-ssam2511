import { ValueIfExists } from '../../../Common/Library/Formatter';
import { GetFSMCrewMemberWrapper } from './FSMS4CrewMemberAddress';

export default function FSMS4CrewMemberMessage(context) {
    const wrapper = GetFSMCrewMemberWrapper(context);
    const message = wrapper.communicationProperty('Mobile');

    return ValueIfExists(message);
}
