
export default function FSMCrewStatusText(context) {
    const status = context.binding.Status;
    return status === 'ACTIVE' ? context.localizeText('wcm_active') : context.localizeText('wcm_inactive');
}
