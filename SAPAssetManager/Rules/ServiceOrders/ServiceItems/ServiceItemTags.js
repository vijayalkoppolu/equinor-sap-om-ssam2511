import IsFSMS4CrewComponentEnabled from '../../ComponentsEnablement/IsFSMS4CrewComponentEnabled';
import FSMCrewLibrary from '../../Crew/FSMCrewLibrary';

export default async function ServiceItemTags(context) {
    let tags = [];

    const itemCrewId = context.binding.CrewID;
    if (IsFSMS4CrewComponentEnabled(context) && itemCrewId) {
        const crewUser = await FSMCrewLibrary.getCrewUserByFSMCrew(context, itemCrewId);
        if (crewUser) {
            tags.push({
                'Text': '$(L,crew_work)',
            });
        }
    }

    return Promise.resolve(tags);
}
