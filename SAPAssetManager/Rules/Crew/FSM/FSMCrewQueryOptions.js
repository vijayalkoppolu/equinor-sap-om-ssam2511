import FSMCrewLibrary from '../FSMCrewLibrary';
import FSMCrewCaption from './FSMCrewCaption';

export default async function FSMCrewQueryOptions(context) {
    const caption = await FSMCrewCaption(context);
    context.getPageProxy().setCaption(caption);
    
    const fsmCrewQueryOptions = await FSMCrewLibrary.getFSMCrewQuery(context);
    return `$expand=CrewListItems&$filter=${fsmCrewQueryOptions}`;
}
