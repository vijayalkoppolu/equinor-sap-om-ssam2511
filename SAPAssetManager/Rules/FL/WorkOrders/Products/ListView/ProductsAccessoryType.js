import IsResvItemReturnButtonEnabled from './IsProductReturnButtonEnabled';
export default function ProductsAccessoryType(clientAPI) {
    if (IsResvItemReturnButtonEnabled(clientAPI) === '') {
        return 'none';
    } else 
    return 'DisclosureIndicator';
}

