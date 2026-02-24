import libVal from '../Common/Library/ValidationLibrary';

export default function NotificationNPCDefault(context) {
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding.NotifProcessingContext))	{
        binding.NotifProcessingContext = '00';
    }
    return binding.NotifProcessingContext;
}
