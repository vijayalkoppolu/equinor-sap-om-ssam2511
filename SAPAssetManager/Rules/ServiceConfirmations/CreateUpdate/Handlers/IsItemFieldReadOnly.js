import IsItemFieldEditable from './IsItemFieldEditable';

export default function IsItemFieldReadOnly(context) {
    return !IsItemFieldEditable(context);
}
