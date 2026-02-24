import {ValueIfExists} from '../../Common/Library/Formatter';
import { GetCrewEmployeeWrapper } from './CrewEmployeeAddress';

export default function CrewEmployeeOffice(context) {
    const wrapper = GetCrewEmployeeWrapper(context);
    let office = wrapper.office(context);
    return ValueIfExists(office);
}
