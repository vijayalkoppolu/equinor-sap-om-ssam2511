import IsFSMS4CrewComponentEnabled from '../ComponentsEnablement/IsFSMS4CrewComponentEnabled';
import FSMCrewLibrary from '../Crew/FSMCrewLibrary';

export default async function SideDrawerCrewCount(context) {
    if (IsFSMS4CrewComponentEnabled(context)) {
        const crewQuery = await FSMCrewLibrary.getFSMCrewQuery(context);
        const crewCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'CrewLists', `$filter=${crewQuery}`);
        return context.localizeText('crew_x', [crewCount]);
    }
    return context.localizeText('crew');
}
