export default function WHInboundDeliveryCheckUOMValidity(context, uom) {
    if (uom.getValue() === '') {
        uom.applyValidation(context.localizeText('field_is_required'));
        
        context.executeAction({
            'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            'Properties': {
                'Message': '$(L,ewm_invalid_uom_error)',
            },
        });
        return false;
    }
    return true;
}
