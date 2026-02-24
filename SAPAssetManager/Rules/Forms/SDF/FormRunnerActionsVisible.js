import IsFormReadOnly from './IsFormReadOnly';

export default async function FormRunnerActionsVisible(clientAPI) {
    return !await IsFormReadOnly(clientAPI);
}
