
 export default function OnPDFGenerated(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        pageProxy.setActionBarItemVisible('SaveButton', true);
        pageProxy.setActionBarItemVisible('ShareButton', true);
    }
 }

