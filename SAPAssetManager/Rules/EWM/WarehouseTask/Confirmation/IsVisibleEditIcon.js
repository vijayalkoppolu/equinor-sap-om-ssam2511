export default function IsVisibleEditIcon(context) {
    const wtstatus = context.binding?.WTStatus;
    return wtstatus !== 'C';
}
