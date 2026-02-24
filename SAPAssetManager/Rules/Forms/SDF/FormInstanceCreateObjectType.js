import getTechnicalEntityKeys from './getTechnicalEntityKeys';

export default function FormInstanceCreateObjectType(context) {
    return getTechnicalEntityKeys(context).objectType;
}
