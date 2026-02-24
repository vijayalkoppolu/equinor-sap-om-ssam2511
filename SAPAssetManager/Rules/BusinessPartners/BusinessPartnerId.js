
export default function BusinessPartnerId(context, binding = context.binding) {
    let partnerId = binding.PartnerNum;
    if (!!binding.NewPartner && partnerId !== binding.NewPartner) {
        partnerId = binding.NewPartner;
    }
    return binding.PersonNum || partnerId || binding.ObjectID || '-';
}
