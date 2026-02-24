export default function FormInstanceCreateFormName(context) {
    return context.getPageProxy()?.getActionBinding()?.FormName;
}
