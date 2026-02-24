export default function SplitDuration(clientAPI, binding) {
    const capacity = binding || clientAPI.binding;

    let allocatedWork = capacity.Work;
    allocatedWork += capacity.UnitForWork ? ` ${capacity.UnitForWork}` : '';

    return allocatedWork;
}
