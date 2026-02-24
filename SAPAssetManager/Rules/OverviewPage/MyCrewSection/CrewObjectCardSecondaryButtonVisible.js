import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';
import ObjectCardSecondaryButtonVisible from '../MyWorkSection/ObjectCardSecondaryButtonVisible';

export default function CrewObjectCardSecondaryButtonVisible(context) {
    if (FSMCrewLibrary.isCrewMemberLeader(context)) { 
        return ObjectCardSecondaryButtonVisible(context);
    } else {
        return false;
    }
}
