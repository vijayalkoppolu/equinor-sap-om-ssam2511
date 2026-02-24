
export default function FSMS4CrewMemberName(context) {
    return context.binding.BusinessPartner_Nav?.FullName || context.binding.BusinessPartner;
}
