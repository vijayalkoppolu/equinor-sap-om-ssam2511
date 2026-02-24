import ODataLibrary from '../OData/ODataLibrary';
export default function ODataUpdateMode(context) {
	let mode = 'Replace';

	if (context.binding && ODataLibrary.hasAnyPendingChanges(context.binding))	{
		mode = 'Merge';
	}

	return mode;
}
