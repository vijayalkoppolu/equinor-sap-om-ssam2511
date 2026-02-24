export default function FormInstanceCreateFormVersion(context) {
    return context.getPageProxy()?.getActionBinding()?.FormVersion;
}
