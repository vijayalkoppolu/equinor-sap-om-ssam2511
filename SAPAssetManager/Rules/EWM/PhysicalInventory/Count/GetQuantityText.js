/**
 * Get the Book quanity text for the Physical inventory document.
 * @param {*} clientAPI 
 * @returns 
 */
export default function GetQuantityText(clientAPI) {
    const bookInventory = clientAPI.binding.BookInventory;
    return bookInventory &&  bookInventory > 0 ? clientAPI.localizeText('book_quantity_x',[clientAPI.binding.BookInventory]) : clientAPI.localizeText('blind_count');
}
