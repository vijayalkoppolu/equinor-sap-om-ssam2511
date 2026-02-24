import getTechnicalEntityKeys from './getTechnicalEntityKeys';

export default function FormInstanceCreateTechnicalEntityType(context) {
    return getTechnicalEntityKeys(context).entityType;
}
