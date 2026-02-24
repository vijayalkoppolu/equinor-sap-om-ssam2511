
import IsResvItemReturnButtonEnabled from './IsResvItemReturnButtonEnabled';
export default function ResvItemAccessoryType(clientAPI) {
    if (IsResvItemReturnButtonEnabled(clientAPI) === '') {
        return 'none';
    } else 
    return 'disclosureIndicator';
}
