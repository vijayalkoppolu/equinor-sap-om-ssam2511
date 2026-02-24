import notification from '../../NotificationLibrary';

export default function NotificationItemDetailsPart(context) {
    try	{
        const objectPartCodeGroup = context.binding.ObjectPartCodeGroup;
        const objectPart = context.binding.ObjectPart;
        return (objectPartCodeGroup && objectPart) ? notification.NotificationCodeStr(context, 'CatTypeObjectParts', objectPartCodeGroup, objectPart) : '-';
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
