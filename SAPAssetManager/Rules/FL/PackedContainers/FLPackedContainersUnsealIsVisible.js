export default function FLPackedContainersUnsealIsVisible(context, binding = context?.getActionBinding?.()) {
    const status = binding?.FldLogsCtnPackgStsCode;
    const transportation_status = binding?.FldLogsCtnIntTranspStsCode;
    return status === '20' && (transportation_status !== '20' && transportation_status !== '30');
}
