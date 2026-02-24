import { ValueIfExists } from '../../../Common/Library/Formatter';
import { GetFSMCrewMemberWrapper } from './FSMS4CrewMemberAddress';

export default function FSMS4CrewMemberOffice(context) {
    const wrapper = GetFSMCrewMemberWrapper(context);
    let office = wrapper.office(context);
    return ValueIfExists(office);
}
