import WorkOrderOperationsListViewGenerateCaption from './WorkOrderOperationsListViewGenerateCaption';

export default function WorkOrderOperationListViewSetCaption(context, sectionContext) {
    return WorkOrderOperationsListViewGenerateCaption(context, sectionContext).then(caption => {
        if (caption) {
            context.getClientData().PageCaption = caption;
            return context.setCaption(caption);
        }
        // If no caption is generated, we can return a default caption.
        return context.setCaption(context.localizeText('operations'));
    }).catch(() => {
        // If there's an error generating the caption, we can either log it or handle it accordingly.
        // For now, we just return undefined.
        return context.setCaption(context.localizeText('operations'));
    });
}
