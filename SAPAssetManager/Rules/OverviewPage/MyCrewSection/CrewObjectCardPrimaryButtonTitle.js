import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';
import ObjectCardButtonTitle from '../MyWorkSection/ObjectCardButtonTitle';

export default function CrewObjectCardPrimaryButtonTitle(context) {
    if (FSMCrewLibrary.isCrewMemberLeader(context)) {
        return ObjectCardButtonTitle(context, ['P']);
    } else {
        return context.localizeText('view');
    }
}
