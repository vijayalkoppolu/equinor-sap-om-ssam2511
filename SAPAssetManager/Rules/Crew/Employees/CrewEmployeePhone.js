import {ValueIfExists} from '../../Common/Library/Formatter';
import { GetCrewEmployeeWrapper } from './CrewEmployeeAddress';

export default function CrewEmployeePhone(context) {
    const wrapper = GetCrewEmployeeWrapper(context);
    let phone = wrapper.communicationProperty('Telephone');
    return ValueIfExists(phone);
}
