import getTechnicalEntityKeys from './getTechnicalEntityKeys';

export default function FormInstanceCreateObjectKey(context) {
    return getTechnicalEntityKeys(context).key;
}
