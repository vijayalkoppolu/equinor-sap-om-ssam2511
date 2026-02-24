import { GlobalVar } from '../../../../Common/Library/GlobalCommon';
import FSMDefaultUserGuid from './FSMDefaultUserGuid';

export default function FSMDefaultUserFullName(context) {
    const lastName = GlobalVar.getUserSystemInfo().get('LASTNAME');
    const firstName = GlobalVar.getUserSystemInfo().get('FIRSTNAME');

    if (firstName && lastName) return firstName + ' ' + lastName;

    return FSMDefaultUserGuid(context);
}
