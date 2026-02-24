import GenerateLocalID from '../../../../Common/GenerateLocalID';

export default function GetFSMFormInstanceId(context) {
    return GenerateLocalID(context, 'FSMFormInstances', 'Id', '0000', '', 'LOCAL_');
}
