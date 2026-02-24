import { BusinessPartnerWrapper } from '../../../BusinessPartners/BusinessPartnerWrapper';
import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function FSMS4CrewMemberAddress(context) {
    const wrapper = GetFSMCrewMemberWrapper(context);
    let address = wrapper.address();
    return ValueIfExists(address);
}

export function GetFSMCrewMemberWrapper(context) {
    const entity = {
        'PartnerFunction_Nav': {
            'PartnerType': 'CREW_S4',
        },
        'BusinessPartner_Nav': context.binding.BusinessPartner_Nav,
    };

    return new BusinessPartnerWrapper(entity);
}
