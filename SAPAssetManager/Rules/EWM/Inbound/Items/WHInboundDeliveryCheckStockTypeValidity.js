export default function WHInboundDeliveryCheckStockTypeValidity(context, stockType) {
    if (stockType.getValue() === '') {
        stockType.applyValidation(context.localizeText('field_is_required'));
        
        context.executeAction({
            'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            'Properties': {
                'Message': '$(L,ewm_invalid_stocktype_error)',
            },
        });
        return false;
    }
    return true;
}
