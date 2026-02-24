import {ValueIfExists} from '../../Common/Library/Formatter';
import { GetCrewEmployeeWrapper } from './CrewEmployeeAddress';

export default function CrewEmployeeEmail(context) {
    const wrapper = GetCrewEmployeeWrapper(context);
    let email = wrapper.communicationProperty('Email');
    return ValueIfExists(email);
}
