
export default function FSMCrewStatusTextStyles(context) {
    const status = context.binding.Status;
    return status === 'ACTIVE' ? 'AcceptedGreen' : 'ResetRed';
}
