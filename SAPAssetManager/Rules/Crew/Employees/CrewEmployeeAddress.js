import {BusinessPartnerWrapper} from '../../BusinessPartners/BusinessPartnerWrapper';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function CrewEmployeeAddress(context) {
    const wrapper = GetCrewEmployeeWrapper(context);
    let address = wrapper.address();
    return ValueIfExists(address);
}

export function GetCrewEmployeeWrapper(context) {
    const entity = {
        'PartnerFunction_Nav': {
            'PartnerType': 'PE',
        },
        'Employee_Nav': context.binding.Employee,
    };

    return new BusinessPartnerWrapper(entity);
}
