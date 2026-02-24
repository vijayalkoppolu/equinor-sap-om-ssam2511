export default function IsVisibleRemoveHuSwitch(context) {
if (context.binding.SourceHU || context.binding.SrcHU) {
    return true;
}
return false;
}
