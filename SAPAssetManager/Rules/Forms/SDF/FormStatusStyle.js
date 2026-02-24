export default function FormStatusStyle(context) {
    const status = context.binding.DynamicFormInstance_Nav.FormStatus === 'Completed' ? 'AcceptedGreen' : undefined;
    return status;
}
