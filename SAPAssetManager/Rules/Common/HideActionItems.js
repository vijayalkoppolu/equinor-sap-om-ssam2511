
export default function HideActionItems(context, count = 1) {
    const pageProxy = context.getPageProxy();
    for (let i = 0; i < count; i++) {
        pageProxy.setActionBarItemVisible(i, false);
    }
}
