import {ValueIfExists} from '../Common/Library/Formatter';
import libDoc from './DocumentLibrary';

export default function DocumentDescription(context) {
    let binding = context.getBindingObject();
    const doc = libDoc.getDocumentFromBinding(binding);
    return decodeURIComponent(ValueIfExists(doc.Description));
}
