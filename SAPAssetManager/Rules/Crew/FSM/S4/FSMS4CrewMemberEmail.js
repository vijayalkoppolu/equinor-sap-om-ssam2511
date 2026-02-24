import { ValueIfExists } from '../../../Common/Library/Formatter';
import { GetFSMCrewMemberWrapper } from './FSMS4CrewMemberAddress';

export default function FSMS4CrewMemberEmail(context) {
    const wrapper = GetFSMCrewMemberWrapper(context);
    const email = wrapper.communicationProperty('Email');

    return ValueIfExists(email);
}
