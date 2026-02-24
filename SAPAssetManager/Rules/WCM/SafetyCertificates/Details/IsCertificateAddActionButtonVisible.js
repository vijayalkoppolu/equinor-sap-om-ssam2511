import EnableNotificationCreate from '../../../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsLotoCertificate from './IsLotoCertificate';
import SDFCreateEnabled from '../../../Forms/SDF/SDFCreateEnabled';

/** @param {IPageProxy} context  */
export default function IsCertificateAddActionButtonVisible(context) {
    return Promise.all([
        IsLotoCertificate(context),
        EnableNotificationCreate(context),
        SDFCreateEnabled(context),
    ]).then(isVisibles => isVisibles.some(i => !!i));
}
