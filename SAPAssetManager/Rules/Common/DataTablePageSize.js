/**
* Data tables don't support paging, so this rule will return a large number to support the loading of all rows at once.
* Using a rule to set the page size allows us to easily change the page size in the future if needed.
* @param {IClientAPI} clientAPI
*/
export default function DataTablePageSize() {
    return 10000;
}
