import ObjectCardButtonOnPress from '../../OverviewPage/MyWorkSection/ObjectCardButtonOnPress';

export default async function NotificationTaskCardSecondaryAndPrimaryActionOnPress(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding();

    return ObjectCardButtonOnPress(context, binding, ['P']);
}
