import IsUploadOnlyPersonalized from '../UserPreferences/IsUploadOnlyPersonalized';

export default function RemoveAfterUploadValue(context) {
    return !IsUploadOnlyPersonalized(context);
}
