import IsAnyNoteTypeAvailable from '../../Notes/Create/IsAnyNoteTypeAvailable';
import QABSettings from '../../QAB/QABSettings';
import IsS4ServiceConfirmationEnabled from '../../ServiceConfirmations/IsS4ServiceConfirmationEnabled';
import IsAddS4RelatedObjectEnabled from '../../ServiceOrders/IsAddS4RelatedObjectEnabled';

export default class ServiceItemsQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createS4ErrorsChip(),
            this._createChip({
                'Label': this._context.localizeText('add_item'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddItem.png,/SAPAssetManager/Images/QABAddItem.android.png)',
                'IsEnabled': true,
                'IsButtonEnabled': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/IsS4ServiceOrderNotCompletedAndCreateEnabled.js',
                'IsButtonVisible': true,
                'Action': '/SAPAssetManager/Rules/ServiceItems/CreateUpdate/CreateServiceItemNav.js',
                '_Name': 'ADD_ITEM',
            }),
            this._createAddServiceOrderChip({
                'Label': this._context.localizeText('add_service_order'),
            }),
            this._createAddServiceRequestChip({ 'Label': this._context.localizeText('add_service_request') }),
            await this._createAddSmartFormChip(),
            this._createChip({
                'Label': this._context.localizeText('confirm_item'),
                'IsEnabled': IsS4ServiceConfirmationEnabled(this._context),
                'IsButtonEnabled': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/AddConfirmationToServiceItemEnabled.js',
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddConfirmationItem.png,/SAPAssetManager/Images/QABAddConfirmationItem.android.png)',
                'IsButtonVisible': true,
                'Action': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/ServiceConfirmationCreateNav.js',
                '_Name': 'CONFIRM_ITEM',
            }),
            this._createRefObjectsChip(),
            await this._createDownloadDocumentsChip(),
            this._createAddNoteChip({ 
                'IsButtonVisibleBySettings': false,
                'IsButtonEnabled': IsAddS4RelatedObjectEnabled(this._context) && await IsAnyNoteTypeAvailable(this._context),
            }),
            this._createAddReminderChip({ 'IsButtonVisibleBySettings': false }),
            this._createAddAttachmentChip({
                'IsButtonEnabled': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/IsS4ServiceOrderNotCompletedAndCreateEnabled.js',
            }),
            this._createBusinessPartnersChip(),
            this._createAddBusinessPartnerChip(),
            this._createSDFChip(),
        ];

        return super.generateChips(chips);
    }
}
