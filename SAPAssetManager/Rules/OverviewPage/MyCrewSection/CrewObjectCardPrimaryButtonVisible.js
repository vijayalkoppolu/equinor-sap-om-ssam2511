import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';
import ObjectCardButtonVisible from '../MyWorkSection/ObjectCardButtonVisible';

export default function CrewObjectCardPrimaryButtonVisible(context) {
    if (FSMCrewLibrary.isCrewMemberLeader(context)) {
        return ObjectCardButtonVisible(context, ['P']);
    } else {
        return true;
    }
}
