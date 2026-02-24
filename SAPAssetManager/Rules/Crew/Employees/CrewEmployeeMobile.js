import {ValueIfExists} from '../../Common/Library/Formatter';
import { GetCrewEmployeeWrapper } from './CrewEmployeeAddress';

export default function CrewEmployeeMobile(context) {
    const wrapper = GetCrewEmployeeWrapper(context);
    let mobile = wrapper.communicationProperty('Mobile');
    return ValueIfExists(mobile);
}
