import IsBusinessPartnerAddNoteVisibile from './IsBusinessPartnerAddNoteVisibile';
import IsBusinessPartnerAddOrderVisible from './IsBusinessPartnerAddOrderVisible';
import IsBusinessPartnerAddRequestVisible from './IsBusinessPartnerAddRequestVisible';

export default function IsBusinessPartnerAddOptionsVisibile(context) {
    return Promise.all([
        IsBusinessPartnerAddOrderVisible(context), 
        IsBusinessPartnerAddRequestVisible(context), 
        IsBusinessPartnerAddNoteVisibile(context),
    ]).then(results => results.some(visible => visible));
}
