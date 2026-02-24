import libPersona from '../../Persona/PersonaLibrary';


export default function NotificationDetailsPageToOpen(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? '/SAPAssetManager/Pages/Notifications/NotificationDetailsClassic.page' : '/SAPAssetManager/Pages/Notifications/NotificationDetails.page';
}

export function NotificationDetailsPageName(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? 'NotificationDetailsClassicPage': 'NotificationDetailsPage';
}
