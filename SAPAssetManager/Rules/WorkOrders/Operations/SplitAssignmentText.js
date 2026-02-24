import TechniciansCount from './TechniciansCount';
import TechnicianFullName from './TechnicianFullName';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import FindAllSplitsForOperation from './FindAllSplitsForOperation';
import FindSplitForCurrentTechnician from './FindSplitForCurrentTechnician';

export default async function SplitAssignmentText(context, operation = context.binding) {
    const techniciansCount = await TechniciansCount(context, operation);
    let description = '';

    if (techniciansCount > 0 && MobileStatusLibrary.isOperationStatusChangeable(context)) {
        const splits = await FindAllSplitsForOperation(context, operation);
        const split = await FindSplitForCurrentTechnician(context, splits);
        let name;

        //if split exists for current technician then show that name first
        if (split) {
            name = TechnicianFullName(context, split);
        } else { //show the first technician's name
            name = TechnicianFullName(context, splits.getItem(0));
        }

        if (name) {
            description += context.localizeText('assignedto') + ' ' + name;

            if (techniciansCount > 1) {
                description += ' +' + (techniciansCount - 1) + ' ' + context.localizeText('more').toLowerCase();
            }
        }
    }

    return description;
}
