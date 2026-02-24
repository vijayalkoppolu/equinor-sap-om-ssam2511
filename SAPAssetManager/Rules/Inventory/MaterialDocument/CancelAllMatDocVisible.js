/**
* Cancel All Material Document Visible...
* @param {IClientAPI} context
*/

import ODataLibrary from '../../OData/ODataLibrary';

export default function CancelAllMatDocVisible(context) {
    return !(ODataLibrary.isLocal(context.binding));
}
