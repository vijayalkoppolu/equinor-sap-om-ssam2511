import libMobile from './MobileStatusLibrary';

export default function OperationMobileStatus(context, binding = context.binding) {
    if (binding && binding.OperationNo && libMobile.isOperationStatusChangeable(context)) {
        let mobileStatus = libMobile.getMobileStatus(binding, context);
        if (mobileStatus === 'D-COMPLETE') {
            return '';
        }
        return mobileStatus ? context.localizeText(mobileStatus) : '';
    } else {
        return '';
    }
}
