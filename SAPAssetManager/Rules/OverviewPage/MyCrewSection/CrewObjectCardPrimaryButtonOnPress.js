import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';
import ObjectCardDetailsNav from '../MyWorkSection/ObjectCardDetailsNav';
import ObjectCardPrimaryButtonOnPress from '../MyWorkSection/ObjectCardPrimaryButtonOnPress';

export default function CrewObjectCardPrimaryButtonOnPress(context) {
    if (FSMCrewLibrary.isCrewMemberLeader(context)) {
        return ObjectCardPrimaryButtonOnPress(context);
    } else {
        return ObjectCardDetailsNav(context);
    }
}
