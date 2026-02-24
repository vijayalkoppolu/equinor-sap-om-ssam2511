import IsAnyNoteTypeAvailable from '../../Notes/Create/IsAnyNoteTypeAvailable';
import QABSettings from '../../QAB/QABSettings';
import IsAddS4RelatedObjectEnabled from '../../ServiceOrders/IsAddS4RelatedObjectEnabled';

export default class ServiceQuotationItemQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createS4ErrorsChip(),
            this._createChip({
                'Label': this._context.localizeText('add_quotation_item'),
                'IsButtonEnabled': '/SAPAssetManager/Rules/ServiceQuotations/IsS4ServiceQuotationCreateEnabled.js',
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddItem.png,/SAPAssetManager/Images/QABAddItem.android.png)',
                'Action': '/SAPAssetManager/Rules/ServiceQuotations/Items/CreateUpdate/CreateServiceQuotationItemNav.js',
                '_Name': 'ADD_ITEM',
            }),
            this._createBusinessPartnersChip({'IsButtonVisibleBySettings': true}),
            this._createRefObjectsChip(),
            this._createAddNoteChip({
                'IsButtonEnabled': IsAddS4RelatedObjectEnabled(this._context) && await IsAnyNoteTypeAvailable(this._context),
            }),
            this._createChip({
                'Label': this._context.localizeText('add_attachment'),
                'IsButtonEnabled': IsAddS4RelatedObjectEnabled(this._context),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddAttachment.ios.png,/SAPAssetManager/Images/QABAddAttachment.android.png)',
                'Action': '/SAPAssetManager/Rules/Documents/Create/DocumentCreateBDSNav.js',
                '_Name': 'ADD_ATTACHMENT',
            }),
          this._createAddReminderChip({'IsButtonVisibleBySettings': false}),
        ];

        return super.generateChips(chips);
    }
}
