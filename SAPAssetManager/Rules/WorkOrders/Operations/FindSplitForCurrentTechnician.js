import CommonLibrary from '../../Common/Library/CommonLibrary';

export default async function FindSplitForCurrentTechnician(context, splits, personNumber = CommonLibrary.getPersonnelNumber(context)) {

     if (splits && splits.length > 0) {
        const split = splits.find(s => s.Employee_Nav && s.Employee_Nav.PersonnelNumber === personNumber);
        return split;
    }
}
